import { BellhopEventDispatcher, BellhopEvent } from './BellhopEventDispatcher';

type DebugCallback = (opts: { isChild: boolean; received: boolean; message: unknown }) => void;
type RespondData =
  | object
  | string
  | number
  | boolean
  | (() => unknown)
  | (() => Promise<unknown>);

export class Bellhop extends BellhopEventDispatcher {
  id: string;
  connected: boolean;
  isChild: boolean;
  connecting: boolean;
  debug: boolean | DebugCallback;
  origin: string | null;
  supported: boolean;
  _sendLater: Array<{ type: string; data: unknown }>;
  iframe: HTMLIFrameElement | null;

  receive = (message: MessageEvent): void => {
    if (this.target !== message.source) {
      return;
    }

    this.logDebugMessage(true, message);

    if (message.data !== 'connected') {
      let data = message.data;
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
    this.onConnectionReceived(message.data);
  };

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

  private onConnectionReceived(message: string): void {
    this.connecting = false;
    this.connected = true;

    if (!this.isChild) {
      if (!this.target) {
        return;
      }
      this.target.postMessage(message, this.origin ?? '*');
    }

    for (let i = 0; i < this._sendLater.length; i++) {
      const { type, data } = this._sendLater[i];
      this.send(type, data);
    }
    this._sendLater.length = 0;

    this.trigger('connected');
  }

  connect(iframe?: HTMLIFrameElement, origin = '*'): void {
    if (this.connecting) {
      return;
    }

    this.disconnect();

    this.connecting = true;

    if (iframe instanceof HTMLIFrameElement) {
      this.iframe = iframe;
    }

    this.isChild = iframe === undefined;

    this.supported = true;
    if (this.isChild) {
      this.supported = (window as Window) !== (iframe as unknown as Window);
    }

    this.origin = origin;

    window.addEventListener('message', this.receive);

    if (this.isChild) {
      if (window === this.target) {
        this.trigger('failed');
      } else {
        (this.target as Window).postMessage('connected', this.origin);
      }
    }
  }

  disconnect(): void {
    this.connected = false;
    this.connecting = false;
    this.origin = null;
    this.iframe = null;
    this.isChild = true;
    this._sendLater.length = 0;

    window.removeEventListener('message', this.receive);
  }

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

  respond(event: string, data: RespondData = {}, runOnce = false): void {
    const bellhop = this;

    const internalCallback = async (e: BellhopEvent): Promise<void> => {
      if (runOnce) {
        bellhop.off(e.type, internalCallback);
      }

      if (typeof data === 'function') {
        bellhop.send(e.type, await data());
      } else {
        bellhop.send(e.type, data);
      }
    };
    this.on(event, internalCallback);
  }

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

  destroy(): void {
    super.destroy();
    this.disconnect();
    this._sendLater.length = 0;
  }

  get target(): Window | null {
    return this.isChild ? window.parent : this.iframe?.contentWindow ?? null;
  }
}
