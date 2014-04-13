!function() {
    "use strict";
    Function.prototype.bind || (Function.prototype.bind = function(that) {
        var args, bound, target = this;
        if ("function" != typeof target) throw new TypeError();
        return args = Array.prototype.slice.call(arguments, 1), bound = function() {
            if (this instanceof bound) {
                var F, self, result;
                return F = function() {}, F.prototype = target.prototype, self = new F(), result = target.apply(self, args.concat(Array.prototype.slice.call(arguments))), 
                Object(result) === result ? result : self;
            }
            return target.apply(that, args.concat(Array.prototype.slice.call(arguments)));
        };
    });
}(), function(global, undefined) {
    "use strict";
    var Bellhop = function(handshakeId) {
        this.handshakeId = handshakeId || "Bellhop", this.onReceive = null, this.target = null, 
        this.connected = !1, this.name = "", this.isChild = !0, this.connecting = !1, this.origin = "*", 
        this._listeners = {}, this._sendLater = [];
    }, p = Bellhop.prototype = {};
    Bellhop.VERSION = "1.0.0", Bellhop.CONNECTED = "connected", Bellhop.FAILED = "failed", 
    p.receive = function(event) {
        var i, len, data = event.data;
        if (data == this.handshakeId) {
            if (this.connecting = !1, this.connected = !0, this.trigger(Bellhop.CONNECTED), 
            this.isChild || this.target.postMessage(data, this.origin), len = this._sendLater.length, 
            len > 0) {
                for (i = 0; len > i; i++) {
                    var e = this._sendLater[i];
                    this.send(e.type, e.data);
                }
                this._sendLater.length = 0;
            }
        } else {
            if (!this.connected) return;
            if ("object" != typeof data) throw "The event received must be an object";
            if (!data.type) throw "The event received must contain a type";
            this.trigger(data);
        }
    }, p.trigger = function(event) {
        "string" == typeof event && (event = {
            type: event
        });
        var listeners = this._listeners[event.type];
        if (listeners !== undefined) for (var i = 0, len = listeners.length; len > i; i++) listeners[i](event);
    }, p.toString = function() {
        return "[Bellhop '" + this.name + "']";
    }, p.connect = function(iframe, origin) {
        if (this.connecting) return this;
        this.connecting = !0;
        var isChild = this.isChild = iframe === undefined;
        return this.target = isChild ? global.top : iframe.contentWindow || iframe, this.origin = origin === undefined ? "*" : origin, 
        this.onReceive = this.receive.bind(this), global.addEventListener("message", this.onReceive), 
        isChild && (window != this.target ? this.target.postMessage(this.handshakeId, this.origin) : (this.connecting = !1, 
        this.connected = !1)), this;
    }, Object.defineProperty(p, "supported", {
        get: function() {
            var target = this.target;
            return this.isChild ? !!target && window != target : !!target;
        }
    }), p.disconnect = function() {
        return this.connected = !1, this.connecting = !1, this.origin = null, this.target = null, 
        this._listeners = {}, this._sendLater.length = 0, this.isChild = !0, global.removeEventListener("message", this.onReceive), 
        this.onReceive = null, this;
    }, p.on = function(type, callback) {
        if ("string" != typeof type) for (var t in type) this.on(t, type[t]); else this._listeners[type] === undefined && (this._listeners[type] = []), 
        this._listeners[type].push(callback);
        return this;
    }, p.off = function(type, callback) {
        if (this._listeners[type] === undefined) return this;
        if (callback === undefined) delete this._listeners[type]; else for (var listeners = this._listeners[type], i = 0, len = listeners.length; len > i; i++) if (listeners[i] === callback) {
            listeners.splice(i, 1);
            break;
        }
        return this;
    }, p.send = function(event, data) {
        if ("string" != typeof event) throw "The event type must be a string";
        if (event = {
            type: event
        }, data !== undefined && (event.data = data), this.connecting) this._sendLater.push(event); else {
            if (!this.connected) return this;
            this.target.postMessage(event, this.origin);
        }
        return this;
    }, p.fetch = function(event, callback, data, runOnce) {
        runOnce = runOnce === undefined ? !1 : runOnce;
        var self = this, internalCallback = function(e) {
            runOnce && self.off(e.type, internalCallback), callback(e);
        };
        return this.on(event, internalCallback), this.send(event, data), this;
    }, p.respond = function(event, data, runOnce) {
        runOnce = runOnce === undefined ? !1 : runOnce;
        var self = this, internalCallback = function(e) {
            runOnce && self.off(e.type, internalCallback), self.send(event, data);
        };
        return this.on(event, internalCallback), this;
    }, p.destroy = function() {
        this.disconnect(), this._listeners = null, this._sendLater = null;
    }, global.Bellhop = Bellhop;
}(window);