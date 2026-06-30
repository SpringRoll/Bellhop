export interface BellhopEvent {
  type: string;
  data: unknown;
}

type PriorityFunction = {
  (event: BellhopEvent): void;
  _priority: number;
};

export class BellhopEventDispatcher {
  private _listeners: Record<string, PriorityFunction[]>;

  constructor() {
    this._listeners = {};
  }

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

  private listenerSorter(a: PriorityFunction, b: PriorityFunction): number {
    return a._priority - b._priority;
  }

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

  destroy(): void {
    this._listeners = {};
  }
}
