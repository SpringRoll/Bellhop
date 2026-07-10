import { BellhopEventDispatcher, BellhopEvent } from './BellhopEventDispatcher';
type DebugCallback = (opts: {
    isChild: boolean;
    received: boolean;
    message: unknown;
}) => void;
type RespondData = object | string | number | boolean | (() => unknown) | (() => Promise<unknown>);
/**
 * Abstract communication layer between the iframe
 * and the parent DOM
 */
export declare class Bellhop extends BellhopEventDispatcher {
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
    _sendLater: Array<{
        type: string;
        data: unknown;
    }>;
    /** The iframe element */
    iframe: HTMLIFrameElement | null;
    /**
     * Handle messages in the window
     * @param message the post message received from another bellhop instance
     */
    receive: (message: MessageEvent) => void;
    /**
     * Creates an instance of Bellhop.
     * @param id the id of the Bellhop instance
     */
    constructor(id?: string | number);
    /**
     * Handle the initial connected message
     * @param message the message received from the other bellhop instance
     */
    private onConnectionReceived;
    /**
     * Setup the connection
     * @param iframe The iframe to communicate with. If no value is set, the assumption
     *        is that we're the child trying to communicate with our window.parent
     * @param origin The domain to communicate with if different from the current.
     */
    connect(iframe?: HTMLIFrameElement, origin?: string): void;
    /**
     * Disconnect if there are any open connections
     */
    disconnect(): void;
    /**
     * Send an event to the connected instance
     * @param type name/type of the event
     * @param data Additional data to send along with event
     */
    send(type: string, data?: unknown): void;
    /**
     * A convenience method for sending and listening to create
     * a singular link for fetching data. This is the same as calling send
     * and then getting a response right away with the same event.
     * @param event The name of the event
     * @param callback The callback to call after, takes event object as one argument
     * @param data Optional data to pass along
     * @param runOnce If we only want to fetch once and then remove the listener
     */
    fetch(event: string, callback: (e: BellhopEvent) => void, data?: unknown, runOnce?: boolean): void;
    /**
     * A convenience method for listening to an event and then responding with some data
     * right away. Automatically removes the listener
     * @param event The name of the event
     * @param data The object to pass back.
     *        May also be a function; the return value (or resolved value) will be sent as data in this case.
     * @param runOnce If we only want to respond once and then remove the listener
     */
    respond(event: string, data?: RespondData, runOnce?: boolean): void;
    /**
     * Send either the default log message or the callback provided if debug
     * is enabled
     */
    logDebugMessage(received: boolean | undefined, message: unknown): void;
    /**
     * Destroy and don't use after this
     */
    destroy(): void;
    /**
     * Returns the correct parent element for Bellhop's context
     * @readonly
     */
    get target(): Window | null;
}
export {};
//# sourceMappingURL=Bellhop.d.ts.map