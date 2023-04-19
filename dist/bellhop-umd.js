!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).window=t.window||{})}(this,(function(t){"use strict";function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t){var n=function(t,n){if("object"!==e(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var i=r.call(t,n||"default");if("object"!==e(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(t)}(t,"string");return"symbol"===e(n)?n:String(n)}function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,r(i.key),i)}}function o(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}var c=function(){function t(){n(this,t),this._listeners={}}return o(t,[{key:"on",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;this._listeners[t]||(this._listeners[t]=[]),e._priority=parseInt(n)||0,-1===this._listeners[t].indexOf(e)&&(this._listeners[t].push(e),this._listeners[t].length>1&&this._listeners[t].sort(this.listenerSorter))}},{key:"listenerSorter",value:function(t,e){return t._priority-e._priority}},{key:"off",value:function(t,e){if(void 0!==this._listeners[t])if(void 0!==e){var n=this._listeners[t].indexOf(e);-1<n&&this._listeners[t].splice(n,1)}else delete this._listeners[t]}},{key:"trigger",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("string"==typeof t&&(t={type:t,data:"object"===e(n)&&null!==n?n:{}}),void 0!==this._listeners[t.type])for(var r=this._listeners[t.type].length-1;r>=0;r--)this._listeners[t.type][r](t)}},{key:"destroy",value:function(){this._listeners={}}}]),t}();function a(){
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
a=function(){return t};var t={},n=Object.prototype,r=n.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},c=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function l(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,n){return t[e]=n}}function f(t,e,n,r){var o=e&&e.prototype instanceof d?e:d,c=Object.create(o.prototype),a=new k(r||[]);return i(c,"_invoke",{value:x(t,n,a)}),c}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=f;var p={};function d(){}function y(){}function v(){}var g={};l(g,c,(function(){return this}));var m=Object.getPrototypeOf,b=m&&m(m(P([])));b&&b!==n&&r.call(b,c)&&(g=b);var w=v.prototype=d.prototype=Object.create(g);function _(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function L(t,n){function o(i,c,a,s){var u=h(t[i],t,c);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==e(f)&&r.call(f,"__await")?n.resolve(f.__await).then((function(t){o("next",t,a,s)}),(function(t){o("throw",t,a,s)})):n.resolve(f).then((function(t){l.value=t,a(l)}),(function(t){return o("throw",t,a,s)}))}s(u.arg)}var c;i(this,"_invoke",{value:function(t,e){function r(){return new n((function(n,r){o(t,e,n,r)}))}return c=c?c.then(r,r):r()}})}function x(t,e,n){var r="suspendedStart";return function(i,o){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===i)throw o;return S()}for(n.method=i,n.arg=o;;){var c=n.delegate;if(c){var a=O(c,n);if(a){if(a===p)continue;return a}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var s=h(t,e,n);if("normal"===s.type){if(r=n.done?"completed":"suspendedYield",s.arg===p)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(r="completed",n.method="throw",n.arg=s.arg)}}}function O(t,e){var n=e.method,r=t.iterator[n];if(void 0===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=void 0,O(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),p;var i=h(r,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,p;var o=i.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,p):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,p)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function k(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function P(t){if(t){var e=t[c];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,i=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return{next:S}}function S(){return{value:void 0,done:!0}}return y.prototype=v,i(w,"constructor",{value:v,configurable:!0}),i(v,"constructor",{value:y,configurable:!0}),y.displayName=l(v,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===y||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,v):(t.__proto__=v,l(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},_(L.prototype),l(L.prototype,s,(function(){return this})),t.AsyncIterator=L,t.async=function(e,n,r,i,o){void 0===o&&(o=Promise);var c=new L(f(e,n,r,i),o);return t.isGeneratorFunction(n)?c:c.next().then((function(t){return t.done?t.value:c.next()}))},_(w),l(w,u,"Generator"),l(w,c,(function(){return this})),l(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},t.values=P,k.prototype={constructor:k,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(j),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,r){return c.type="throw",c.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var i=this.tryEntries.length-1;i>=0;--i){var o=this.tryEntries[i],c=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var a=r.call(o,"catchLoc"),s=r.call(o,"finallyLoc");if(a&&s){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(a){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var c=o?o.completion:{};return c.type=t,c.arg=e,o?(this.method="next",this.next=o.finallyLoc,p):this.complete(c)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),p},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),j(n),p}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var i=r.arg;j(n)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:P(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),p}},t}function s(t,e,n,r,i,o,c){try{var a=t[o](c),s=a.value}catch(t){return void n(t)}a.done?e(s):Promise.resolve(s).then(r,i)}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function l(t){return l=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},l(t)}function f(){return f="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=l(t)););return t}(t,e);if(r){var i=Object.getOwnPropertyDescriptor(r,e);return i.get?i.get.call(arguments.length<3?t:n):i.value}},f.apply(this,arguments)}function h(t,e){return h=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},h(t,e)}function p(t){var n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,i=l(t);if(n){var o=l(this).constructor;r=Reflect.construct(i,arguments,o)}else r=i.apply(this,arguments);return function(t,n){if(n&&("object"===e(n)||"function"==typeof n))return n;if(void 0!==n)throw new TypeError("Derived constructors may only return object or undefined");return u(t)}(this,r)}}var d=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&h(t,e)}(i,t);var r=p(i);function i(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:100*Math.random()|0;return n(this,i),(t=r.call(this)).id="BELLHOP:".concat(e),t.connected=!1,t.isChild=!0,t.connecting=!1,t.debug=!1,t.origin="*",t._sendLater=[],t.iframe=null,t.receive=t.receive.bind(u(t)),t}return o(i,[{key:"receive",value:function(t){if(this.target===t.source)if(this.logDebugMessage(!0,t),"connected"===t.data)this.onConnectionReceived(t.data);else{var n=t.data;if("string"==typeof n)try{n=JSON.parse(n)}catch(t){console.warn("Bellhop error: ",t)}this.connected&&"object"===e(n)&&n.type&&this.trigger(n)}}},{key:"onConnectionReceived",value:function(t){if(this.connecting=!1,this.connected=!0,!this.isChild){if(!this.target)return;this.target.postMessage(t,this.origin)}for(var e=0;e<this._sendLater.length;e++){var n=this._sendLater[e],r=n.type,i=n.data;this.send(r,i)}this._sendLater.length=0,this.trigger("connected")}},{key:"connect",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"*";this.connecting||(this.disconnect(),this.connecting=!0,t instanceof HTMLIFrameElement&&(this.iframe=t),this.isChild=void 0===t,this.supported=!0,this.isChild&&(this.supported=window!=t),this.origin=e,window.addEventListener("message",this.receive),this.isChild&&(window===this.target?this.trigger("failed"):this.target.postMessage("connected",this.origin)))}},{key:"disconnect",value:function(){this.connected=!1,this.connecting=!1,this.origin=null,this.iframe=null,this.isChild=!0,this._sendLater.length=0,window.removeEventListener("message",this.receive)}},{key:"send",value:function(t){if("string"!=typeof t)throw"The event type must be a string";var e={type:t,data:arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}};this.logDebugMessage(!1,e),this.connecting?this._sendLater.push(e):this.target.postMessage(JSON.stringify(e),this.origin)}},{key:"fetch",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(!this.connecting&&!this.connected)throw"No connection, please call connect() first";this.on(t,(function t(r){i&&n.off(r.type,t),e(r)})),this.send(t,r)}},{key:"respond",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=this,i=function(){var t,o=(t=a().mark((function t(o){return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n&&r.off(o,i),"function"!=typeof e){t.next=10;break}return t.t0=r,t.t1=o.type,t.next=6,e();case 6:t.t2=t.sent,t.t0.send.call(t.t0,t.t1,t.t2),t.next=11;break;case 10:r.send(o.type,e);case 11:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,i){var o=t.apply(e,n);function c(t){s(o,r,i,c,a,"next",t)}function a(t){s(o,r,i,c,a,"throw",t)}c(void 0)}))});return function(t){return o.apply(this,arguments)}}();this.on(t,i)}},{key:"logDebugMessage",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=arguments.length>1?arguments[1]:void 0;this.debug&&"function"==typeof this.debug?this.debug({isChild:this.isChild,received:t,message:e}):this.debug&&console.log("Bellhop Instance (".concat(this.isChild?"Child":"Parent",") ").concat(t?"Receieved":"Sent"),e)}},{key:"destroy",value:function(){f(l(i.prototype),"destroy",this).call(this),this.disconnect(),this._sendLater.length=0}},{key:"target",get:function(){return this.isChild?window.parent:this.iframe.contentWindow}}]),i}(c);t.Bellhop=d,t.BellhopEventDispatcher=c}));
//# sourceMappingURL=bellhop-umd.js.map
