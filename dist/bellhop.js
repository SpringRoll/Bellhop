function t(t,e){return t(e={exports:{}},e.exports),e.exports}var e=t((function(t){function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(r){return"function"==typeof Symbol&&"symbol"===e(Symbol.iterator)?t.exports=n=function(t){return e(t)}:t.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":e(t)},n(r)}t.exports=n}));var n=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")};function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=function(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t},i=function(){function t(){n(this,t),this._listeners={}}return o(t,[{key:"on",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;this._listeners[t]||(this._listeners[t]=[]),e._priority=parseInt(n)||0,-1===this._listeners[t].indexOf(e)&&(this._listeners[t].push(e),this._listeners[t].length>1&&this._listeners[t].sort(this.listenerSorter))}},{key:"listenerSorter",value:function(t,e){return t._priority-e._priority}},{key:"off",value:function(t,e){if(void 0!==this._listeners[t])if(void 0!==e){var n=this._listeners[t].indexOf(e);-1<n&&this._listeners[t].splice(n,1)}else delete this._listeners[t]}},{key:"trigger",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("string"==typeof t&&(t={type:t,data:"object"===e(n)&&null!==n?n:{}}),void 0!==this._listeners[t.type])for(var r=this._listeners[t.type].length-1;r>=0;r--)this._listeners[t.type][r](t)}},{key:"destroy",value:function(){this._listeners={}}}]),t}(),s=t((function(t){var e=function(t){var e,n=Object.prototype,r=n.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",a=o.toStringTag||"@@toStringTag";function c(t,e,n,r){var o=e&&e.prototype instanceof d?e:d,i=Object.create(o.prototype),s=new S(r||[]);return i._invoke=function(t,e,n){var r=h;return function(o,i){if(r===f)throw new Error("Generator is already running");if(r===p){if("throw"===o)throw i;return P()}for(n.method=o,n.arg=i;;){var s=n.delegate;if(s){var a=O(s,n);if(a){if(a===y)continue;return a}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===h)throw r=p,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=f;var c=u(t,e,n);if("normal"===c.type){if(r=n.done?p:l,c.arg===y)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r=p,n.method="throw",n.arg=c.arg)}}}(t,n,s),i}function u(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=c;var h="suspendedStart",l="suspendedYield",f="executing",p="completed",y={};function d(){}function v(){}function g(){}var m={};m[i]=function(){return this};var w=Object.getPrototypeOf,b=w&&w(w(j([])));b&&b!==n&&r.call(b,i)&&(m=b);var _=g.prototype=d.prototype=Object.create(m);function x(t){["next","throw","return"].forEach((function(e){t[e]=function(t){return this._invoke(e,t)}}))}function L(t){function e(n,o,i,s){var a=u(t[n],t,o);if("throw"!==a.type){var c=a.arg,h=c.value;return h&&"object"==typeof h&&r.call(h,"__await")?Promise.resolve(h.__await).then((function(t){e("next",t,i,s)}),(function(t){e("throw",t,i,s)})):Promise.resolve(h).then((function(t){c.value=t,i(c)}),(function(t){return e("throw",t,i,s)}))}s(a.arg)}var n;this._invoke=function(t,r){function o(){return new Promise((function(n,o){e(t,r,n,o)}))}return n=n?n.then(o,o):o()}}function O(t,n){var r=t.iterator[n.method];if(r===e){if(n.delegate=null,"throw"===n.method){if(t.iterator.return&&(n.method="return",n.arg=e,O(t,n),"throw"===n.method))return y;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return y}var o=u(r,t.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,y;var i=o.arg;return i?i.done?(n[t.resultName]=i.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,y):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,y)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function k(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function S(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function j(t){if(t){var n=t[i];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,s=function n(){for(;++o<t.length;)if(r.call(t,o))return n.value=t[o],n.done=!1,n;return n.value=e,n.done=!0,n};return s.next=s}}return{next:P}}function P(){return{value:e,done:!0}}return v.prototype=_.constructor=g,g.constructor=v,g[a]=v.displayName="GeneratorFunction",t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,a in t||(t[a]="GeneratorFunction")),t.prototype=Object.create(_),t},t.awrap=function(t){return{__await:t}},x(L.prototype),L.prototype[s]=function(){return this},t.AsyncIterator=L,t.async=function(e,n,r,o){var i=new L(c(e,n,r,o));return t.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},x(_),_[a]="Generator",_[i]=function(){return this},_.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=j,S.prototype={constructor:S,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(k),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function o(r,o){return a.type="throw",a.arg=t,n.next=r,o&&(n.method="next",n.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var s=this.tryEntries[i],a=s.completion;if("root"===s.tryLoc)return o("end");if(s.tryLoc<=this.prev){var c=r.call(s,"catchLoc"),u=r.call(s,"finallyLoc");if(c&&u){if(this.prev<s.catchLoc)return o(s.catchLoc,!0);if(this.prev<s.finallyLoc)return o(s.finallyLoc)}else if(c){if(this.prev<s.catchLoc)return o(s.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<s.finallyLoc)return o(s.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var s=i?i.completion:{};return s.type=t,s.arg=e,i?(this.method="next",this.next=i.finallyLoc,y):this.complete(s)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),y},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),k(n),y}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;k(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:j(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),y}},t}(t.exports);try{regeneratorRuntime=e}catch(t){Function("r","regeneratorRuntime = r")(e)}}));var a=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t};var c=function(t,n){return!n||"object"!==e(n)&&"function"!=typeof n?a(t):n},u=t((function(t){function e(n){return t.exports=e=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},e(n)}t.exports=e}));var h=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=u(t)););return t},l=t((function(t){function e(n,r,o){return"undefined"!=typeof Reflect&&Reflect.get?t.exports=e=Reflect.get:t.exports=e=function(t,e,n){var r=h(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}},e(n,r,o||n)}t.exports=e})),f=t((function(t){function e(n,r){return t.exports=e=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},e(n,r)}t.exports=e}));var p=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)},y=function(t){function r(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:100*Math.random()|0;return n(this,r),(t=c(this,u(r).call(this))).id="BELLHOP:".concat(e),t.connected=!1,t.isChild=!0,t.connecting=!1,t.debug=!1,t.origin="*",t._sendLater=[],t.iframe=null,t.receive=t.receive.bind(a(t)),t}return p(r,i),o(r,[{key:"receive",value:function(t){if(this.target===t.source)if(this.logDebugMessage(!0,t),"connected"===t.data)this.onConnectionReceived(t.data);else{var n=t.data;if("string"==typeof n)try{n=JSON.parse(n)}catch(t){console.error("Bellhop error: ",t)}this.connected&&"object"===e(n)&&n.type&&this.trigger(n)}}},{key:"onConnectionReceived",value:function(t){this.connecting=!1,this.connected=!0,this.isChild||this.target.postMessage(t,this.origin);for(var e=0;e<this._sendLater.length;e++){var n=this._sendLater[e],r=n.type,o=n.data;this.send(r,o)}this._sendLater.length=0,this.trigger("connected")}},{key:"connect",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"*";this.connecting||(this.disconnect(),this.connecting=!0,t instanceof HTMLIFrameElement&&(this.iframe=t),this.isChild=void 0===t,this.supported=!0,this.isChild&&(this.supported=window!=t),this.origin=e,window.addEventListener("message",this.receive),this.isChild&&(window===this.target?this.trigger("failed"):this.target.postMessage("connected",this.origin)))}},{key:"disconnect",value:function(){this.connected=!1,this.connecting=!1,this.origin=null,this.iframe=null,this.isChild=!0,this._sendLater.length=0,window.removeEventListener("message",this.receive)}},{key:"send",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("string"!=typeof t)throw"The event type must be a string";var n={type:t,data:e};this.logDebugMessage(!1,n),this.connecting?this._sendLater.push(n):this.target.postMessage(JSON.stringify(n),this.origin)}},{key:"fetch",value:function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(!this.connecting&&!this.connected)throw"No connection, please call connect() first";var i=function t(r){o&&n.off(r.type,t),e(r)};this.on(t,i),this.send(t,r)}},{key:"respond",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=this,o=function t(o){var i;return s.async((function(a){for(;;)switch(a.prev=a.next){case 0:return n&&r.off(o,t),"function"==typeof e&&(e=e()),a.next=4,s.awrap(e);case 4:i=a.sent,r.send(o.type,i);case 6:case"end":return a.stop()}}))};this.on(t,o)}},{key:"logDebugMessage",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=arguments.length>1?arguments[1]:void 0;this.debug&&"function"==typeof this.debug?this.debug({isChild:this.isChild,received:!1,message:e}):this.debug&&console.log("Bellhop Instance (".concat(this.isChild?"Child":"Parent",") ").concat(t?"Receieved":"Sent"),e)}},{key:"destroy",value:function(){l(u(r.prototype),"destroy",this).call(this),this.disconnect(),this._sendLater.length=0}},{key:"target",get:function(){return this.isChild?window.parent:this.iframe.contentWindow}}]),r}();export{y as Bellhop,i as BellhopEventDispatcher};
//# sourceMappingURL=bellhop.js.map
