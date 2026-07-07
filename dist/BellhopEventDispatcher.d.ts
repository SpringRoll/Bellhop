export interface BellhopEvent {
    type: string;
    data: unknown;
}
export declare class BellhopEventDispatcher {
    private _listeners;
    constructor();
    on(name: string, callback: (event: BellhopEvent) => void, priority?: number): void;
    private listenerSorter;
    off(name: string, callback?: (event: BellhopEvent) => void): void;
    trigger(event: BellhopEvent | string, data?: unknown): void;
    destroy(): void;
}
//# sourceMappingURL=BellhopEventDispatcher.d.ts.map