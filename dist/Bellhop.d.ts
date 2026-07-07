import { BellhopEventDispatcher, BellhopEvent } from './BellhopEventDispatcher';
type DebugCallback = (opts: {
    isChild: boolean;
    received: boolean;
    message: unknown;
}) => void;
type RespondData = object | string | number | boolean | (() => unknown) | (() => Promise<unknown>);
export declare class Bellhop extends BellhopEventDispatcher {
    id: string;
    connected: boolean;
    isChild: boolean;
    connecting: boolean;
    debug: boolean | DebugCallback;
    origin: string | null;
    supported: boolean;
    _sendLater: Array<{
        type: string;
        data: unknown;
    }>;
    iframe: HTMLIFrameElement | null;
    receive: (message: MessageEvent) => void;
    constructor(id?: string | number);
    private onConnectionReceived;
    connect(iframe?: HTMLIFrameElement, origin?: string): void;
    disconnect(): void;
    send(type: string, data?: unknown): void;
    fetch(event: string, callback: (e: BellhopEvent) => void, data?: unknown, runOnce?: boolean): void;
    respond(event: string, data?: RespondData, runOnce?: boolean): void;
    logDebugMessage(received: boolean | undefined, message: unknown): void;
    destroy(): void;
    get target(): Window | null;
}
export {};
//# sourceMappingURL=Bellhop.d.ts.map