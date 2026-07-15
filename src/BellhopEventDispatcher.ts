export interface BellhopEvent {
  type: string;
  data: unknown;
}

/**
 * Function with an added priority property, used to order event listeners.
 */
type PriorityFunction = {
  (event: BellhopEvent): void;
  _priority: number;
};

/**
 * Generic event dispatcher
 */
export class BellhopEventDispatcher {
  /** The collection of event listeners keyed by event name */
  private _listeners: Record<string, PriorityFunction[]>;

  constructor() {
    this._listeners = {};
  }

  /**
   * Add an event listener to listen to an event from either the parent or iframe
   * @param name The name of the event to listen for
   * @param callback The handler when an event is triggered
   * @param priority The priority of the event listener. Higher numbers are handled first.
   */
  on(name: string, callback: (event: BellhopEvent) => void, priority = 0): void {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }
    const priorityFn = callback as PriorityFunction;
    priorityFn._priority = Math.trunc(priority) || 0;

    if (-1 !== this._listeners[name].indexOf(priorityFn)) {
      return;
    }

    this._listeners[name].push(priorityFn);

    if (this._listeners[name].length > 1) {
      this._listeners[name].sort(this.listenerSorter);
    }
  }

  /**
   * Sorts listeners added by .on() by priority
   */
  private listenerSorter(a: PriorityFunction, b: PriorityFunction): number {
    return a._priority - b._priority;
  }

  /**
   * Remove an event listener
   * @param name The name of event to listen for. If callback is undefined, remove all listeners for this name.
   * @param callback The optional handler when an event is triggered, if no callback
   *        is set then all listeners by type are removed
   */
  off(name: string, callback?: (event: BellhopEvent) => void): void {
    if (this._listeners[name] === undefined) {
      return;
    }

    if (callback === undefined) {
      delete this._listeners[name];
      return;
    }

    const index = this._listeners[name].indexOf(callback as PriorityFunction);
    if (-1 < index) {
      this._listeners[name].splice(index, 1);
    }
  }

  /**
   * Trigger any event handlers for an event type
   * @param event The event to send
   * @param data optional data to send to other areas in the app that are listening for this event
   */
  trigger(event: BellhopEvent | string, data: unknown = {}): void {
    if (typeof event === 'string') {
      event = {
        type: event,
        data: typeof data === 'object' && data !== null ? data : {}
      };
    }

    if ('undefined' !== typeof this._listeners[event.type]) {
      for (let i = this._listeners[event.type].length - 1; i >= 0; i--) {
        this._listeners[event.type][i](event as BellhopEvent);
      }
    }
  }

  /**
   * Reset the listeners object
   */
  destroy(): void {
    this._listeners = {};
  }
}
