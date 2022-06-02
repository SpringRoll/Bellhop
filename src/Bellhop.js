import { BellhopEventDispatcher } from './BellhopEventDispatcher.js';

/**
 *  Abstract communication layer between the iframe
 *  and the parent DOM
 *  @class Bellhop
 *  @extends BellhopEventDispatcher
 */
export class Bellhop extends BellhopEventDispatcher {
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
     *  If we are connected to another instance of bellhop
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
     *  If we are currently trying to connect
     *  @property {Boolean} connecting
     *  @default false
     *  @private
     */
    this.connecting = false;

    /**
     * If debug mode is turned on
     *  @property {Boolean} debug
     *  @default false
     *  @private
     */
    this.debug = false;

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

    /**
     * The bound receive function
     * @property {Function} receive
     * @private
     */
    this.receive = this.receive.bind(this);
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

    this.logDebugMessage(true, message);

    // If this is not the initial connection message
    if (message.data !== 'connected') {
      let data = message.data;
      // Check to see if the data was sent as a stringified json
      if ('string' === typeof data) {
        try {
          data = JSON.parse(data);
        } catch (err) {
          console.warn('Bellhop error: ', err);
        }
      }
      if (this.connected && 'object' === typeof data && data.type) {
        this.trigger(data);
      }
      return;
    }
    // Else setup the connection
    this.onConnectionReceived(message.data);
  }
  /**
   * Handle the initial connected message
   * @memberof Bellhop
   * @param {object} message the message received from the other bellhop instance
   * @private
   */
  onConnectionReceived(message) {
    this.connecting = false;
    this.connected = true;

    // Be polite and respond to the child that we're ready
    if (!this.isChild) {
      // Timing issue: this.iframe.contentWindow is null when parent closes child iframe before done with rendering
      if (!this.target) {
        return;
      }
      this.target.postMessage(message, this.origin);
    }

    // If we have any sends waiting to send
    // we are now connected and it should be okay
    for (let i = 0; i < this._sendLater.length; i++) {
      const { type, data } = this._sendLater[i];
      this.send(type, data);
    }
    this._sendLater.length = 0;

    // If there is a connection event assigned call it
    this.trigger('connected');
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

    window.addEventListener('message', this.receive);

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

    this.logDebugMessage(false, message);

    if (this.connecting) {
      this._sendLater.push(message);
    } else {
      this.target.postMessage(JSON.stringify(message), this.origin);
    }
  }

  /**
   *  A convenience method for sending and listening to create
   *  a singular link for fetching data. This is the same as calling send
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
   *  @param {Object | function | Promise | string} [data = {}] The object to pass back.
   *  	May also be a function; the return value will be sent as data in this case.
   *  @param {Boolean} [runOnce=false] If we only want to respond once and then remove the listener
   *
   */
  respond(event, data = {}, runOnce = false) {
    const bellhop = this; //'this' for use inside async function
    /**
     * @ignore
     */
    const internalCallback = async function(event) {
      if (runOnce) {
        bellhop.off(event, internalCallback);
      }

      if (typeof data === 'function') {
        bellhop.send(event.type, await data());
      } else {
        bellhop.send(event.type, data);
      }

    };
    this.on(event, internalCallback);
  }

  /**
   * Send either the default log message or the callback provided if debug
   * is enabled
   * @method logDebugMessage
   */
  logDebugMessage(received = false, message) {
    if (this.debug && typeof this.debug === 'function') {
      this.debug({ isChild: this.isChild, received, message: message });
    } else if (this.debug) {
      console.log(
        `Bellhop Instance (${this.isChild ? 'Child' : 'Parent'}) ${
          received ? 'Receieved' : 'Sent'
        }`,
        message
      );
    }
  }

  /**
   *  Destroy and don't use after this
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
