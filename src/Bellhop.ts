import { BellhopEventDispatcher, BellhopEvent } from './BellhopEventDispatcher';

type DebugCallback = (opts: { isChild: boolean; received: boolean; message: unknown }) => void;
type RespondData =
  | object
  | string
  | number
  | boolean
  | (() => unknown)
  | (() => Promise<unknown>);

/**
 * Abstract communication layer between the iframe
 * and the parent DOM
 */
export class Bellhop extends BellhopEventDispatcher {
  /** The instance ID for bellhop */
  id: string;
  /** If we are connected to another instance of bellhop */
  connected: boolean;
  /** If this instance represents an iframe instance */
  isChild: boolean;
  /** If we are currently trying to connect */
  connecting: boolean;
  /** If debug mode is turned on */
  debug: boolean | DebugCallback;
  /** If using cross-domain, the domain to post to */
  origin: string | null;
  /** If the current environment supports the connection */
  supported: boolean;
  /** Save any sends to wait until after we're done connecting */
  _sendLater: Array<{ type: string; data: unknown }>;
  /** The iframe element */
  iframe: HTMLIFrameElement | null;

  /**
   * Handle messages in the window
   * @param message the post message received from another bellhop instance
   */
  receive = (message: MessageEvent): void => {
    // Ignore messages that don't originate from the target we're connected to
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
      if (this.connected && 'object' === typeof data && (data as BellhopEvent).type) {
        this.trigger(data as BellhopEvent);
      }
      return;
    }
    // Else setup the connection
    this.onConnectionReceived(message.data);
  };

  /**
   * Creates an instance of Bellhop.
   * @param id the id of the Bellhop instance
   */
  constructor(id: string | number = (Math.random() * 100) | 0) {
    super();

    this.id = `BELLHOP:${id}`;
    this.connected = false;
    this.isChild = true;
    this.connecting = false;
    this.debug = false;
    this.origin = '*';
    this.supported = false;
    this._sendLater = [];
    this.iframe = null;
  }

  /**
   * Handle the initial connected message
   * @param message the message received from the other bellhop instance
   */
  private onConnectionReceived(message: string): void {
    this.connecting = false;
    this.connected = true;

    // Be polite and respond to the child that we're ready
    if (!this.isChild) {
      // Timing issue: this.target is null when parent closes child iframe before done with rendering
      if (!this.target) {
        return;
      }
      this.target.postMessage(message, this.origin ?? '*');
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
   * Setup the connection
   * @param iframe The iframe to communicate with. If no value is set, the assumption
   *        is that we're the child trying to communicate with our window.parent
   * @param origin The domain to communicate with if different from the current.
   */
  connect(iframe?: HTMLIFrameElement, origin = '*'): void {
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
      this.supported = (window as Window) !== (iframe as unknown as Window);
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
        (this.target as Window).postMessage('connected', this.origin);
      }
    }
  }

  /**
   * Disconnect if there are any open connections
   */
  disconnect(): void {
    this.connected = false;
    this.connecting = false;
    this.origin = null;
    this.iframe = null;
    this.isChild = true;
    this._sendLater.length = 0;

    window.removeEventListener('message', this.receive);
  }

  /**
   * Send an event to the connected instance
   * @param type name/type of the event
   * @param data Additional data to send along with event
   */
  send(type: string, data: unknown = {}): void {
    if (typeof type !== 'string') {
      throw 'The event type must be a string';
    }

    const message = { type, data };

    this.logDebugMessage(false, message);

    if (this.connecting) {
      this._sendLater.push(message);
    } else {
      (this.target as Window).postMessage(JSON.stringify(message), this.origin ?? '*');
    }
  }

  /**
   * A convenience method for sending and listening to create
   * a singular link for fetching data. This is the same as calling send
   * and then getting a response right away with the same event.
   * @param event The name of the event
   * @param callback The callback to call after, takes event object as one argument
   * @param data Optional data to pass along
   * @param runOnce If we only want to fetch once and then remove the listener
   */
  fetch(event: string, callback: (e: BellhopEvent) => void, data: unknown = {}, runOnce = false): void {
    if (!this.connecting && !this.connected) {
      throw 'No connection, please call connect() first';
    }

    const internalCallback = (e: BellhopEvent): void => {
      if (runOnce) {
        this.off(e.type, internalCallback);
      }
      callback(e);
    };

    this.on(event, internalCallback);
    this.send(event, data);
  }

  /**
   * A convenience method for listening to an event and then responding with some data
   * right away. Automatically removes the listener
   * @param event The name of the event
   * @param data The object to pass back.
   *        May also be a function; the return value (or resolved value) will be sent as data in this case.
   * @param runOnce If we only want to respond once and then remove the listener
   */
  respond(event: string, data: RespondData = {}, runOnce = false): void {
    const internalCallback = async (e: BellhopEvent): Promise<void> => {
      if (runOnce) {
        this.off(e.type, internalCallback);
      }

      if (typeof data === 'function') {
        this.send(e.type, await data());
      } else {
        this.send(e.type, data);
      }
    };
    this.on(event, internalCallback);
  }

  /**
   * Send either the default log message or the callback provided if debug
   * is enabled
   */
  logDebugMessage(received = false, message: unknown): void {
    if (this.debug && typeof this.debug === 'function') {
      this.debug({ isChild: this.isChild, received, message });
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
   * Destroy and don't use after this
   */
  destroy(): void {
    super.destroy();
    this.disconnect();
    this._sendLater.length = 0;
  }

  /**
   * Returns the correct parent element for Bellhop's context
   * @readonly
   */
  get target(): Window | null {
    return this.isChild ? window.parent : this.iframe?.contentWindow ?? null;
  }
}
