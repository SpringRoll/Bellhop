/**
 * Generic event dispatcher
 * @class  BellhopEventDispatcher
 */
export default class BellhopEventDispatcher {
  /**
   *  The collection of event listeners
   *  @property {Object} _listeners
   *  @private
   */
  constructor() {
    this._listeners = {};
  }

  /**
   *  Add an event listener to the listen to an event from either the parent or iframe
   *  @method on
   *  @param {String|Object} eventType The type of event to listen for or a map of events to callbacks.
   *         Multiple events can be added by separating events with spaces.
   *  @param {Function} callback The handler when an event is triggered
   *  @param {number} [priority=0] The priority of the event listener. Higher numbers are handled first.
   *  @return {this} Return instance of current object
   */
  on(eventType, callback, priority) {
    if ('string' !== typeof type) {
      for (let type in eventType) {
        this.on(type, eventType[type], priority);
      }
    } else {
      const types = eventType.split(' ');

      for (let i = 0, l = types.length; i < l; i++) {
        const type = types[i];

        if (!this._listeners[type]) {
          this._listeners[type] = [];
        }

        callback._priority = parseInt(priority) || 0;

        if (this._listeners[type].indexOf(callback) === -1) {
          this._listeners[type].push(callback);
          if (this._listeners[type].length > 1) {
            this._listeners[type].sort(this.listenerSorter);
          }
        }
      }
    }
    return this;
  }

  /**
   *  Sorts listeners added by .on() by priority
   */
  listenerSorter(a, b) {
    return a._priority - b._priority;
  }

  /**
   *  Remove an event listener
   *  @method off
   *  @param {String} type The type of event to listen for. If undefined, remove all listeners.
   *  @param {Function} [callback] The optional handler when an event is triggered, if no callback
   *         is set then all listeners by type are removed
   *  @return {this} Return instance of current object
   */
  off(type, callback) {
    if (type === undefined || !this._listeners) {
      //remove all listeners
      this._listeners = {};
      return this;
    }
    if (this._listeners[type] === undefined) {
      return this;
    }
    if (callback === undefined) {
      delete this._listeners[type];
    } else {
      for (let i = 0, l = this._listeners[type].length; i < l; i++) {
        // Remove the listener
        if (this._listeners[type][i] === callback) {
          this._listeners[type].splice(i, 1);
          break;
        }
      }
    }
    return this;
  }

  /**
   *  Trigger any event handlers for an event type
   *  @method trigger
   *  @param {Object} event The event to send
   */
  trigger(event) {
    if (typeof event == 'string') {
      event = {
        type: event
      };
    }

    if (this._listeners[event.type] !== undefined) {
      for (let i = this._listeners[event.type].length - 1; i >= 0; i--) {
        this._listeners[event.type][i](event);
      }
    }
  }

  /**
   * Destroy this object
   * @method  destroy
   */
  destroy() {
    this._listeners = null;
  }
}
