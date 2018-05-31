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
   *  @param {String|Object} type The type of event to listen for or a map of events to callbacks.
   *         Multiple events can be added by separating events with spaces.
   *  @param {Function} callback The handler when an event is triggered
   *  @param {number} [priority=0] The priority of the event listener. Higher numbers are handled first.
   *  @return {this} Return instance of current object
   */
  on(type, callback, priority) {
    if (typeof type !== 'string') {
      for (let t in type) {
        this.on(t, type[t], priority);
      }
    } else {
      let types = type.split(' ');
      let listener;
      for (let i = 0, len = types.length; i < len; i++) {
        type = types[i];

        listener = this._listeners[type];
        if (!listener) {
          listener = this._listeners[type] = [];
        }

        callback._priority = parseInt(priority) || 0;

        if (listener.indexOf(callback) === -1) {
          listener.push(callback);
          if (listener.length > 1) {
            listener.sort(this.listenerSorter);
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
      let listeners = this._listeners[type];
      for (let i = 0, len = listeners.length; i < len; i++) {
        // Remove the listener
        if (listeners[i] === callback) {
          listeners.splice(i, 1);
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
    let listeners = this._listeners[event.type];
    if (listeners !== undefined) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        listeners[i](event);
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
