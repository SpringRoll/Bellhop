/**
 * Function with a added priority type
 * @typedef {Function} PriorityFunction
 * @property {number} _priority
 */

/**
 * Generic event dispatcher
 * @class  BellhopEventDispatcher
 */
class BellhopEventDispatcher {
  /**
   *  The collection of event listeners
   *  @property {Object} _listeners
   *  @private
   */
  constructor() {
    this._listeners = {};
  }

  /**
   *  Add an event listener to the listen to an event from either the parent or iframe
   *  @method on
   *  @param {String} name The name of the event to listen
   *  @param {PriorityFunction} callback The handler when an event is triggered
   *  @param {number} [priority=0] The priority of the event listener. Higher numbers are handled first.
   */
  on(name, callback, priority = 0) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }
    callback._priority = parseInt(priority) || 0;

    // If callback is already set to this event
    if (-1 !== this._listeners[name].indexOf(callback)) {
      return;
    }

    this._listeners[name].push(callback);

    if (this._listeners[name].length > 1) {
      this._listeners[name].sort(this.listenerSorter);
    }
  }

  /**
   * @private
   * @param {PriorityFunction} a
   * @param {PriorityFunction} b
   * @returns {number};
   *  Sorts listeners added by .on() by priority
   */
  listenerSorter(a, b) {
    return a._priority - b._priority;
  }

  /**
   *  Remove an event listener
   *  @method off
   *  @param {String} name The name of event to listen for. If undefined, remove all listeners.
   *  @param {Function} callback The optional handler when an event is triggered, if no callback
   *         is set then all listeners by type are removed
   */
  off(name, callback) {
    if (this._listeners[name] === undefined) {
      return;
    }

    if (callback === undefined) {
      delete this._listeners[name];
      return;
    }

    const index = this._listeners[name].indexOf(callback);

    -1 < index ? this._listeners[name].splice(index, 1) : undefined;
  }

  /**
   *  Trigger any event handlers for an event type
   *  @method trigger
   *  @param {Object | String} event The event to send
   */
  trigger(event) {
    if (typeof event == 'string') {
      event = {
        type: event
      };
    }

    if ('undefined' !== typeof this._listeners[event.type]) {
      for (let i = this._listeners[event.type].length - 1; i >= 0; i--) {
        this._listeners[event.type][i](event);
      }
    }
  }

  /**
   * Reset the listeners object
   * @method  destroy
   */
  destroy() {
    this._listeners = {};
  }
}

/**
 *  Abstract the communication layer between the iframe
 *  and the parent DOM
 *  @class Bellhop
 *  @extends BellhopEventDispatcher
 */
class Bellhop extends BellhopEventDispatcher {
  /**
   * Creates an instance of Bellhop.
   * @memberof Bellhop
   * @param { string | number } id the id of the Bellhop instance
   */
  constructor(id = (Math.random() * 100) | 0) {
    super();

    /**
     *  The instance ID for bellhop
     *  @property {string} id
     */
    this.id = `BELLHOP:${id}`;
    /**
     *  If we are connected to another instance of the bellhop
     *  @property {Boolean} connected
     *  @readOnly
     *  @default false
     *  @private
     */
    this.connected = false;

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
     *  @property {string} origin
     *  @private
     *  @default "*"
     */
    this.origin = '*';

    /**
     *  Save any sends to wait until after we're done
     *  @property {Array} _sendLater
     *  @private
     */
    this._sendLater = [];

    /**
     * The iframe element
     * @property {HTMLIFrameElement} iframe
     * @private
     * @readOnly
     */
    this.iframe = null;
  }

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
   *  @param { MessageEvent } message the post message received from another bellhop instance
   *  @private
   */
  receive(message) {
    // Ignore messages that don't originate from the target
    // we're connected to
    if (this.target !== message.source) {
      return;
    }

    // If this is not the initial connection message
    if (message.data !== 'connected') {
      // Ignore all other message if we don't have a context
      if (
        this.connected &&
        'object' === typeof message.data &&
        message.data.type
      ) {
        this.trigger(message.data);
      }
      return;
    }
    // Else setup the connection
    this.onConnectionReceived(message.data);
  }
  /**
   * @memberof Bellhop
   * @param {object} message the message received from the other bellhop instance
   * @private
   */
  onConnectionReceived(message) {
    this.connecting = false;
    this.connected = true;

    // If there is a connection event assigned call it
    this.trigger('connected');

    // Be polite and respond to the child that we're ready
    if (!this.isChild) {
      this.target.postMessage(message, this.origin);
    }

    // If we have any sends waiting to send
    // we are now connected and it should be okay
    for (let i = 0, length = this._sendLater.length; i < length; i++) {
      const { type, data } = this._sendLater[i];
      this.send(type, data);
    }
    this._sendLater.length = 0;
  }

  /**
   *  Setup the connection
   *  @method connect
   *  @param {HTMLIFrameElement} iframe The iframe to communicate with. If no value is set, the assumption
   *         is that we're the child trying to communcate with our window.parent
   *  @param {String} [origin="*"] The domain to communicate with if different from the current.
   *  @return {Bellhop} Return instance of current object
   */
  connect(iframe, origin = '*') {
    // Ignore if we're already trying to connect
    if (this.connecting) {
      return;
    }

    // Disconnect from any existing connection
    this.disconnect();

    // We are trying to connect
    this.connecting = true;

    // The iframe if we're the parent
    if (iframe instanceof HTMLIFrameElement) {
      this.iframe = iframe;
    }

    // The instance of bellhop is inside the iframe
    this.isChild = iframe === undefined;

    this.supported = true;
    if (this.isChild) {
      // for child pages, the window passed must be a different window
      this.supported = window != iframe;
    }

    this.origin = origin;

    window.addEventListener('message', this.receive.bind(this));

    if (this.isChild) {
      // No parent, can't connect
      if (window === this.target) {
        this.trigger('failed');
      } else {
        // If connect is called after the window is ready
        // we can go ahead and send the connect message
        this.target.postMessage('connected', this.origin);
      }
    }
  }

  /**
   *  Disconnect if there are any open connections
   *  @method disconnect
   */
  disconnect() {
    this.connected = false;
    this.connecting = false;
    this.origin = null;
    this.iframe = null;
    this.isChild = true;
    this._sendLater.length = 0;

    window.removeEventListener('message', this.receive);
  }

  /**
   *  Send an event to the connected instance
   *  @method send
   *  @param {string} type name/type of the event
   *  @param {*} [data = {}] Additional data to send along with event
   */
  send(type, data = {}) {
    if (typeof type !== 'string') {
      throw 'The event type must be a string';
    }

    const message = {
      type,
      data
    };

    if (this.connecting) {
      this._sendLater.push(message);
    } else {
      this.target.postMessage(message, this.origin);
    }
  }

  /**
   *  A convenience method for sending and the listening to create
   *  a singular link to fetching data. This is the same calling send
   *  and then getting a response right away with the same event.
   *  @method fetch
   *  @param {String} event The name of the event
   *  @param {Function} callback The callback to call after, takes event object as one argument
   *  @param {Object} [data = {}] Optional data to pass along
   *  @param {Boolean} [runOnce=false] If we only want to fetch once and then remove the listener
   */
  fetch(event, callback, data = {}, runOnce = false) {
    if (!this.connecting && !this.connected) {
      throw 'No connection, please call connect() first';
    }

    const internalCallback = e => {
      if (runOnce) {
        this.off(e.type, internalCallback);
      }

      callback(e);
    };

    this.on(event, internalCallback);
    this.send(event, data);
  }

  /**
   *  A convience method for listening to an event and then responding with some data
   *  right away. Automatically removes the listener
   *  @method respond
   *  @param {String} event The name of the event
   *  @param {Object} [data = {}] The object to pass back.
   *  	May also be a function; the return value will be sent as data in this case.
   *  @param {Boolean} [runOnce=false] If we only want to respond once and then remove the listener
   */
  respond(event, data = {}, runOnce = false) {
    const internalCallback = e => {
      if (runOnce) {
        this.off(e.type, internalCallback);
      }
      this.send(event, data);
    };
    this.on(event, internalCallback);
  }

  /**
   *  Destroy and don't user after this
   *  @method destroy
   */
  destroy() {
    super.destroy();
    this.disconnect();
    this._sendLater.length = 0;
  }

  /**
   *
   * Returns the correct parent element for Bellhop's context
   * @readonly
   * @memberof Bellhop
   */
  get target() {
    return this.isChild ? window.parent : this.iframe.contentWindow;
  }
}

export { BellhopEventDispatcher, Bellhop };
//# sourceMappingURL=bellhop.js.map
