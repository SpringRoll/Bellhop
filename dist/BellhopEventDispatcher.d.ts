export interface BellhopEvent {
    type: string;
    data: unknown;
}
/**
 * Generic event dispatcher
 */
export declare class BellhopEventDispatcher {
    /** The collection of event listeners keyed by event name */
    private _listeners;
    constructor();
    /**
     * Add an event listener to listen to an event from either the parent or iframe
     * @param name The name of the event to listen for
     * @param callback The handler when an event is triggered
     * @param priority The priority of the event listener. Higher numbers are handled first.
     */
    on(name: string, callback: (event: BellhopEvent) => void, priority?: number): void;
    /**
     * Sorts listeners added by .on() by priority
     */
    private listenerSorter;
    /**
     * Remove an event listener
     * @param name The name of event to listen for. If callback is undefined, remove all listeners for this name.
     * @param callback The optional handler when an event is triggered, if no callback
     *        is set then all listeners by type are removed
     */
    off(name: string, callback?: (event: BellhopEvent) => void): void;
    /**
     * Trigger any event handlers for an event type
     * @param event The event to send
     * @param data optional data to send to other areas in the app that are listening for this event
     */
    trigger(event: BellhopEvent | string, data?: unknown): void;
    /**
     * Reset the listeners object
     */
    destroy(): void;
}
//# sourceMappingURL=BellhopEventDispatcher.d.ts.map