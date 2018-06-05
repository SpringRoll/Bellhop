import BellhopEventDispatcher from './BellhopEventDispatcher.js';
/**
 *  Abstract the communication layer between the iframe
 *  and the parent DOM
 *  @class Bellhop
 *  @extends BellhopEventDispatcher
 */
export default class Bellhop extends BellhopEventDispatcher {
  /**
   * Creates an instance of Bellhop.
   * @memberof Bellhop
   */
  constructor(id) {
    super();

    this.id = id;
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
    this.origin = '*';

    /**
     *  Save any sends to wait until after we're done
     *  @property {Array} _sendLater
     *  @private
     */
    this._sendLater = [];

    /**
     * The iframe element
     * @property {DOMElement} iframe
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
   *  @private
   */
  receive(event) {
    console.log(event);
    // Ignore events that don't originate from the target
    // we're connected to

    if (this.getTarget !== event.source) {
      return;
    }

    const data = event.data;

    // This is the initial connection event
    if (data === 'connected') {
      this.connecting = false;
      this.connected = true;

      this.trigger('connected');

      // Be polite and respond to the child that we're ready
      if (!this.isChild) {
        this.getTarget.postMessage(data, this.origin);
      }

      const len = this._sendLater.length;

      // If we have any sends waiting to send
      // we are now connected and it should be okay
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          const e = this._sendLater[i];
          this.send(e.data);
        }
        this._sendLater.length = 0;
      }
    } else {
      console.log('hit');
      // Ignore all other event if we don't have a context
      if (!this.connected) {
        return;
      }
      console.log(data);
      // Only valid objects with a type and matching channel id
      if ('object' === typeof data && data.type) {
        this.trigger(data);
      }
    }
  }

  /**
   *  Setup the connection
   *  @method connect
   *  @param {HTMLIFrameElement}  [iframe] The iframe to communicate with. If no value is set, the assumption
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
    this.iframe = iframe || null;

    // The instance of bellhop is inside the iframe
    this.isChild = iframe === undefined;

    this.origin = origin;
    window.addEventListener('message', this.receive.bind(this));
    if (this.isChild) {
      // No parent, can't connect
      if (window === this.getTarget) {
        this.trigger('failed');
      } else {
        this.getTarget.postMessage('connected', this.origin);
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

    if (this._sendLater) {
      this._sendLater.length = 0;
    }

    window.removeEventListener('message', this.receive);
  }

  /**
   *  Send an event to the connected instance
   *  @method send
   *  @param {*} [data] Additional data to send along with event
   */
  send(event, data) {
    if (typeof event !== 'string') {
      throw 'The event type must be a string';
    }
    event = {
      type: event
    };

    // Add the additional data, if needed
    if (data !== undefined) {
      event.data = data;
    }

    if (this.connecting) {
      this._sendLater.push(event);
    } else {
      this.getTarget.postMessage(event, this.origin);
    }
  }

  /**
   *  A convenience method for sending and the listening to create
   *  a singular link to fetching data. This is the same calling send
   *  and then getting a response right away with the same event.
   *  @method fetch
   *  @param {String} event The name of the event
   *  @param {Function} callback The callback to call after, takes event object as one argument
   *  @param {Object} [data] Optional data to pass along
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
   *  @param {Object} data The object to pass back.
   *  	May also be a function; the return value will be sent as data in this case.
   *  @param {Boolean} [runOnce=false] If we only want to respond once and then remove the listener
   */
  respond(event, data = {}, runOnce = false) {
    const internalCallback = e => {
      if (runOnce) {
        this.off(e.type, internalCallback);
      }
      this.send(data);
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
    this._sendLater = null;
  }

  /**
   *
   *
   * @returns {Window}
   * @memberof Bellhop
   */
  get getTarget() {
    return this.isChild ? window.parent : this.iframe.contentWindow;
  }
}
