(function(window, undefined){

	/**
	*  Abstract the communication layer between the iframe
	*  and the parent DOM
	*  @class Bellhop
	*/
	var Bellhop = function()
	{
		/**
		*  Bound handler for the window message event
		*  @property {Function} onReceive
		*  @private
		*/
		this.onReceive = this.receive.bind(this);

		/**
		*  The target where to send messages
		*  @property {DOM} target
		*  @private
		*/
		this.target = null;

		/**
		*  If we are connected to another instance of the bellhop
		*  @property {Boolean} connected
		*  @readOnly
		*  @default false
		*  @private
		*/
		this.connected = false;

		/**
		*  The name of this Bellhop instance, useful for debugging purposes
		*  @param {String} name
		*/
		this.name = '';

		/**
		*  If this instance represents an iframe instance
		*  @property {Boolean} isChild
		*  @private
		*  @default true
		*/
		this.isChild = true;

		/**
		*  If we are current trying to connec
		*  @property {Boolean} connecting
		*  @default false
		*  @private
		*/
		this.connecting = false;

		/**
		*  If using cross-domain, the domain to post to
		*  @property {Boolean} origin
		*  @private
		*  @default "*"
		*/
		this.origin = "*";

		/**
		*  The collection of event listeners
		*  @property {Object} _listeners
		*  @private
		*/
		this._listeners = {};

		/**
		*  Save any sends to wait until after we're done
		*  @property {Array} _sendLater
		*  @private
		*/
		this._sendLater = [];

		/**
		*  Do we have something to connect to, should be called after
		*  attempting to `connect()`
		*  @property {Boolean} supported
		*  @readOnly
		*/
		this.supported = null;
	};

	// Reference to the prototype
	var p = Bellhop.prototype = {};

	/**
	*  The connection has been established successfully
	*  @event connected
	*/

	/**
	*  Connection could not be established
	*  @event failed
	*/

	/**
	*  Handle messages in the window
	*  @method receive
	*  @private
	*/
	p.receive = function(event)
	{
		// Ignore events that don't originate from the target
		// we're connected to
		if (event.source !== this.target)
		{
			return;
		}

		var data = event.data;

		// This is the initial connection event
		if (data === 'connected')
		{
			this.connecting = false;
			this.connected = true;

			this.trigger('connected');

			// Be polite and respond to the child that we're ready
			if (!this.isChild)
			{
				this.target.postMessage(data, this.origin);
			}

			var i, len = this._sendLater.length;

			// If we have any sends waiting to send
			// we are now connected and it should be okay 
			if (len > 0)
			{
				for(i = 0; i < len; i++)
				{
					var e = this._sendLater[i];
					this.send(e.type, e.data);
				}
				this._sendLater.length = 0;
			}
		}		
		else
		{
			// Ignore all other event if we don't have a context
			if (!this.connected) return;

			try 
			{
				data = JSON.parse(data);
			}
			catch(err)
			{
				// If we can't parse the JSON
				// just ignore it, this should
				// only be an object
				return;
			}

			// Only valid objects with a type and matching channel id
			if (typeof data === "object" && data.type)
			{
				this.trigger(data);
			}			
		}
	};

	/**
	*  Trigger any event handlers for an event type
	*  @method trigger
	*  @private
	*  @param {Object} event The event to send
	*/
	p.trigger = function(event)
	{
		if (typeof event == "string")
		{
			event = {type:event};
		}
		var listeners = this._listeners[event.type];
		if (listeners !== undefined)
		{
			for(var i = 0, len = listeners.length; i < len; i++)
			{
				listeners[i](event);
			}
		}
	};

	/**
	*  And override for the toString built-in method
	*  @method toString
	*  @return {String} Representation of this instance
	*/
	p.toString = function()
	{
		return "[Bellhop '"+this.name+"']";
	};

	/**
	*  Setup the connection
	*  @method connect
	*  @param {DOM} [iframe] The iframe to communicate with. If no value is set, the assumption
	*         is that we're the child trying to communcate with our window.top parent
	*  @param {String} [origin="*"] The domain to communicate with if different from the current.
	*  @return {Bellhop} Return instance of current object
	*/
	p.connect = function(iframe, origin)
	{
		// Ignore if we're already trying to connect
		if (this.connecting) return this;

		// Disconnect from any existing connection
		this.disconnect();

		// We are trying to connect
		this.connecting = true;

		// The instance of bellhop is inside the iframe
		var isChild = this.isChild = (iframe === undefined);
		var target = this.target = isChild ? window.top : (iframe.contentWindow || iframe);
		this.supported = isChild ? (!!target && window != target) : !!target;
		this.origin = origin === undefined ? "*" : origin;

		// Listen for incoming messages
		if (window.attachEvent)
		{
			window.attachEvent("onmessage", this.onReceive);
		}
		else
		{
			window.addEventListener("message", this.onReceive);
		}

		if (isChild)
		{
			// No parent, can't connect
			if (window === target)
			{
				this.trigger('failed');
			}
			else
			{
				// Wait until the window is finished loading
				// then send the handshake to the parent
				window.onload = function(){
					target.postMessage('connected', this.origin);
				}.bind(this);
			}
		}
		return this;
	};

	/**
	*  Disconnect if there are any open connections
	*  @method disconnect
	*/
	p.disconnect = function()
	{
		this.connected = false;
		this.connecting = false;
		this.origin = null;
		this.target = null;
		this._listeners = {};
		this._sendLater.length = 0;
		this.isChild = true;

		if (window.detachEvent)
		{
			window.detachEvent("onmessage", this.onReceive);
		}
		else
		{
			window.removeEventListener("message", this.onReceive);
		}

		return this;
	};

	/**
	*  Add an event listener to the listen to an event from either the parent or iframe
	*  @method on
	*  @param {String|Object} type The type of event to listen for or a map of events to callbacks.
	*         Multiple events can be added by separating events with spaces.
	*  @param {Function} callback The handler when an event is triggered
	*  @return {Bellhop} Return instance of current object
	*/
	p.on = function(type, callback)
	{
		if (typeof type !== "string")
		{
			for(var t in type)
			{
				this.on(t, type[t]);
			}
		}
		else
		{
			var types = type.split(" ");

			for(var i = 0, len = types.length; i < len; i++)
			{
				type = types[i];

				if (this._listeners[type] === undefined)
				{
					this._listeners[type] = [];
				}
				this._listeners[type].push(callback);
			}
		}
		return this;
	};

	/**
	*  Remove an event listener
	*  @method off
	*  @param {String} type The type of event to listen for
	*  @param {Function} [callback] The optional handler when an event is triggered, if no callback
	*         is set then all listeners by type are removed
	*  @return {Bellhop} Return instance of current object
	*/
	p.off = function(type, callback)
	{
		if (this._listeners[type] === undefined)
		{
			return this;
		}
		if (callback === undefined)
		{
			delete this._listeners[type];
		}
		else
		{
			var listeners = this._listeners[type];
			for(var i = 0, len = listeners.length; i < len; i++)
			{
				// Remove the listener
				if (listeners[i] === callback)
				{
					listeners.splice(i, 1);
					break;
				}
			}
		}
		return this;
	};

	/**
	*  Send an event to the connected instance
	*  @method send
	*  @param {String} event The event type to send to the parent
	*  @param {Object} [data] Additional data to send along with event
	*  @return {Bellhop} Return instance of current object
	*/
	p.send = function(event, data)
	{
		if (typeof event !== "string")
		{
			throw "The event type must be a string";
		}
		event = { type: event };

		// Add the additional data, if needed
		if (data !== undefined)
		{
			event.data = data;
		}
		if (this.connecting)
		{
			this._sendLater.push(event);
		}
		else if (!this.connected)
		{
			return this;
		}
		else
		{
			this.target.postMessage(JSON.stringify(event), this.origin);
		}
		return this;
	};

	/**
	*  A convenience method for sending and the listening to create 
	*  a singular link to fetching data. This is the same calling send
	*  and then getting a response right away with the same event.
	*  @method fetch
	*  @param {String} event The name of the event
	*  @param {Function} callback The callback to call after, takes event object as one argument
	*  @param {Object} [data] Optional data to pass along
	*  @param {Boolean} [runOnce=false] If we only want to fetch once and then remove the listener
	*  @return {Bellhop} Return instance of current object
	*/
	p.fetch = function(event, callback, data, runOnce)
	{
		var self = this;

		if (!this.connecting && !this.connected)
		{
			throw "No connection, please call connect() first";
		}
		
		runOnce = runOnce === undefined ? false : runOnce;
		var internalCallback = function(e)
		{
			if (runOnce) self.off(e.type, internalCallback);
			callback(e);
		};
		this.on(event, internalCallback);
		this.send(event, data);
		return this;
	};

	/**
	*  A convience method for listening to an event and then responding with some data
	*  right away. Automatically removes the listener
	*  @method respond
	*  @param {String} event The name of the event
	*  @param {Object} data The object to pass back
	*  @param {Boolean} [runOnce=false] If we only want to respond once and then remove the listener
	*  @return {Bellhop} Return instance of current object
	*/
	p.respond = function(event, data, runOnce)
	{
		runOnce = runOnce === undefined ? false : runOnce;
		var self = this;
		var internalCallback = function(e)
		{
			if (runOnce) self.off(e.type, internalCallback);
			self.send(event, data);
		};
		this.on(event, internalCallback);
		return this;
	};

	/**
	*  Destroy and don't user after this
	*  @method destroy
	*/
	p.destroy = function()
	{
		this.disconnect();
		this._listeners = null;
		this._sendLater = null;
	};

	// Assign to the global namespace
	window.Bellhop = Bellhop;

}(window));
