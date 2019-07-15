/*!
 * mota-evaluador v0.3.0
 * Evaluador de Transparencia Activa en Colombia - Iniciativa MOTA
 * (c) 2019 
 * MIT License
 * https://github.com/Dejusticia/mota-evaluador-publico
 */

/*!
 * atomicjs v4.4.0
 * A tiny, Promise-based vanilla JS Ajax/HTTP plugin with great browser support.
 * (c) 2019 Chris Ferdinandi
 * MIT License
 * https://github.com/cferdinandi/atomic
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], (function () {
			return factory(root);
		}));
	} else if (typeof exports === 'object') {
		module.exports = factory(root);
	} else {
		window.atomic = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, (function (window) {

	'use strict';

	//
	// Variables
	//

	var settings;

	// Default settings
	var defaults = {
		method: 'GET',
		username: null,
		password: null,
		data: {},
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		responseType: 'text',
		timeout: null,
		withCredentials: false
	};


	//
	// Methods
	//

	/**
	 * Feature test
	 * @return {Boolean} If true, required methods and APIs are supported
	 */
	var supports = function () {
		return 'XMLHttpRequest' in window && 'JSON' in window && 'Promise' in window;
	};

	/**
	 * Merge two or more objects together.
	 * @param   {Object}   objects  The objects to merge together
	 * @returns {Object}            Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (var i = 0; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Parse text response into JSON
	 * @private
	 * @param  {String} req The response
	 * @return {Array}      A JSON Object of the responseText, plus the orginal response
	 */
	var parse = function (req) {
		var result;
		if (settings.responseType !== 'text' && settings.responseType !== '') {
			return {data: req.response, xhr: req};
		}
		try {
			result = JSON.parse(req.responseText);
		} catch (e) {
			result = req.responseText;
		}
		return {data: result, xhr: req};
	};

	/**
	 * Convert an object into a query string
	 * @link   https://blog.garstasio.com/you-dont-need-jquery/ajax/
	 * @param  {Object|Array|String} obj The object
	 * @return {String}                  The query string
	 */
	var param = function (obj) {

		// If already a string, or if a FormData object, return it as-is
		if (typeof (obj) === 'string' || Object.prototype.toString.call(obj) === '[object FormData]') return obj;

		// If the content-type is set to JSON, stringify the JSON object
		if (/application\/json/i.test(settings.headers['Content-type']) || Object.prototype.toString.call(obj) === '[object Array]') return JSON.stringify(obj);

		// Otherwise, convert object to a serialized string
		var encoded = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				encoded.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
			}
		}
		return encoded.join('&');

	};

	/**
	 * Make an XHR request, returned as a Promise
	 * @param  {String} url The request URL
	 * @return {Promise}    The XHR request Promise
	 */
	var makeRequest = function (url) {

		// Create the XHR request
		var request = new XMLHttpRequest();

		// Setup the Promise
		var xhrPromise = new Promise(function (resolve, reject) {

			// Setup our listener to process compeleted requests
			request.onreadystatechange = function () {

				// Only run if the request is complete
				if (request.readyState !== 4) return;

				// Process the response
				if (request.status >= 200 && request.status < 300) {
					// If successful
					resolve(parse(request));
				} else {
					// If failed
					reject({
						status: request.status,
						statusText: request.statusText,
						responseText : request.responseText
					});
				}

			};

			// Setup our HTTP request
			request.open(settings.method, url, true, settings.username, settings.password);
			request.responseType = settings.responseType;

			// Add headers
			for (var header in settings.headers) {
				if (settings.headers.hasOwnProperty(header)) {
					request.setRequestHeader(header, settings.headers[header]);
				}
			}

			// Set timeout
			if (settings.timeout) {
				request.timeout = settings.timeout;
				request.ontimeout = function (e) {
					reject({
						status: 408,
						statusText: 'Request timeout'
					});
				};
			}

			// Add withCredentials
			if (settings.withCredentials) {
				request.withCredentials = true;
			}

			// Send the request
			request.send(param(settings.data));

		});

		// Cancel the XHR request
		xhrPromise.cancel = function () {
			request.abort();
		};

		// Return the request as a Promise
		return xhrPromise;

	};

	/**
	 * Instatiate Atomic
	 * @param {String} url      The request URL
	 * @param {Object} options  A set of options for the request [optional]
	 */
	var Atomic = function (url, options) {

		// Check browser support
		if (!supports()) throw 'Atomic: This browser does not support the methods used in this plugin.';

		// Merge options into defaults
		settings = extend(defaults, options || {});

		// Make request
		return makeRequest(url);

	};


	//
	// Public Methods
	//

	return Atomic;

}));

/*! atomicjs v4.4.0 | (c) 2019 Chris Ferdinandi | MIT License | https://github.com/cferdinandi/atomic */
!(function(e,t){"function"==typeof define&&define.amd?define([],(function(){return t(e)})):"object"==typeof exports?module.exports=t(e):window.atomic=t(e)})("undefined"!=typeof global?global:"undefined"!=typeof window?window:this,(function(e){"use strict";var t,n={method:"GET",username:null,password:null,data:{},headers:{"Content-type":"application/x-www-form-urlencoded"},responseType:"text",timeout:null,withCredentials:!1},o=function(){for(var e={},t=function(t){for(var n in t)t.hasOwnProperty(n)&&("[object Object]"===Object.prototype.toString.call(t[n])?e[n]=o(e[n],t[n]):e[n]=t[n])},n=0;n<arguments.length;n++){t(arguments[n])}return e},r=function(e){var n=new XMLHttpRequest,o=new Promise(function(o,r){for(var s in n.onreadystatechange=function(){4===n.readyState&&(n.status>=200&&n.status<300?o(function(e){var n;if("text"!==t.responseType&&""!==t.responseType)return{data:e.response,xhr:e};try{n=JSON.parse(e.responseText)}catch(t){n=e.responseText}return{data:n,xhr:e}}(n)):r({status:n.status,statusText:n.statusText,responseText:n.responseText}))},n.open(t.method,e,!0,t.username,t.password),n.responseType=t.responseType,t.headers)t.headers.hasOwnProperty(s)&&n.setRequestHeader(s,t.headers[s]);t.timeout&&(n.timeout=t.timeout,n.ontimeout=function(e){r({status:408,statusText:"Request timeout"})}),t.withCredentials&&(n.withCredentials=!0),n.send(function(e){if("string"==typeof e||"[object FormData]"===Object.prototype.toString.call(e))return e;if(/application\/json/i.test(t.headers["Content-type"])||"[object Array]"===Object.prototype.toString.call(e))return JSON.stringify(e);var n=[];for(var o in e)e.hasOwnProperty(o)&&n.push(encodeURIComponent(o)+"="+encodeURIComponent(e[o]));return n.join("&")}(t.data))});return o.cancel=function(){n.abort()},o};return function(s,i){if(!("XMLHttpRequest"in e&&"JSON"in e&&"Promise"in e))throw"Atomic: This browser does not support the methods used in this plugin.";return t=o(n,i||{}),r(s)}}));
/*!
 * atomicjs v4.4.0
 * A tiny, Promise-based vanilla JS Ajax/HTTP plugin with great browser support.
 * (c) 2019 Chris Ferdinandi
 * MIT License
 * https://github.com/cferdinandi/atomic
 */

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.4+314e4831
 */
/* jshint ignore:start */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap((function () {
      return invokeCallback(_state, child, callback, parent._result);
    }));
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var TRY_CATCH_ERROR = { error: null };

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    TRY_CATCH_ERROR.error = error;
    return TRY_CATCH_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap((function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, (function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }), (function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }), 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }), promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, (function (value) {
      return resolve(promise, value);
    }), (function (reason) {
      return reject(promise, reason);
    }));
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === TRY_CATCH_ERROR) {
      reject(promise, TRY_CATCH_ERROR.error);
      TRY_CATCH_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = void 0,
      failed = void 0;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver((function resolvePromise(value) {
      resolve(promise, value);
    }), (function rejectPromise(reason) {
      reject(promise, reason);
    }));
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = (function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, (function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }), (function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    }));
  };

  return Enumerator;
})();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = (function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves

    Synchronous example:

    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }

    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```

    Asynchronous example:

    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```

    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    return promise.then((function (value) {
      return constructor.resolve(callback()).then((function () {
        return value;
      }));
    }), (function (reason) {
      return constructor.resolve(callback()).then((function () {
        throw reason;
      }));
    }));
  };

  return Promise;
})();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));
/* jshint ignore:end */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], (function () {
			return factory(root);
		}));
	} else if (typeof exports === 'object') {
		module.exports = factory(root);
	} else {
		window.atomic = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, (function (window) {

	'use strict';

	//
	// Variables
	//

	var settings;

	// Default settings
	var defaults = {
		method: 'GET',
		username: null,
		password: null,
		data: {},
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		responseType: 'text',
		timeout: null,
		withCredentials: false
	};


	//
	// Methods
	//

	/**
	 * Feature test
	 * @return {Boolean} If true, required methods and APIs are supported
	 */
	var supports = function () {
		return 'XMLHttpRequest' in window && 'JSON' in window && 'Promise' in window;
	};

	/**
	 * Merge two or more objects together.
	 * @param   {Object}   objects  The objects to merge together
	 * @returns {Object}            Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (var i = 0; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Parse text response into JSON
	 * @private
	 * @param  {String} req The response
	 * @return {Array}      A JSON Object of the responseText, plus the orginal response
	 */
	var parse = function (req) {
		var result;
		if (settings.responseType !== 'text' && settings.responseType !== '') {
			return {data: req.response, xhr: req};
		}
		try {
			result = JSON.parse(req.responseText);
		} catch (e) {
			result = req.responseText;
		}
		return {data: result, xhr: req};
	};

	/**
	 * Convert an object into a query string
	 * @link   https://blog.garstasio.com/you-dont-need-jquery/ajax/
	 * @param  {Object|Array|String} obj The object
	 * @return {String}                  The query string
	 */
	var param = function (obj) {

		// If already a string, or if a FormData object, return it as-is
		if (typeof (obj) === 'string' || Object.prototype.toString.call(obj) === '[object FormData]') return obj;

		// If the content-type is set to JSON, stringify the JSON object
		if (/application\/json/i.test(settings.headers['Content-type']) || Object.prototype.toString.call(obj) === '[object Array]') return JSON.stringify(obj);

		// Otherwise, convert object to a serialized string
		var encoded = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				encoded.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
			}
		}
		return encoded.join('&');

	};

	/**
	 * Make an XHR request, returned as a Promise
	 * @param  {String} url The request URL
	 * @return {Promise}    The XHR request Promise
	 */
	var makeRequest = function (url) {

		// Create the XHR request
		var request = new XMLHttpRequest();

		// Setup the Promise
		var xhrPromise = new Promise(function (resolve, reject) {

			// Setup our listener to process compeleted requests
			request.onreadystatechange = function () {

				// Only run if the request is complete
				if (request.readyState !== 4) return;

				// Process the response
				if (request.status >= 200 && request.status < 300) {
					// If successful
					resolve(parse(request));
				} else {
					// If failed
					reject({
						status: request.status,
						statusText: request.statusText,
						responseText : request.responseText
					});
				}

			};

			// Setup our HTTP request
			request.open(settings.method, url, true, settings.username, settings.password);
			request.responseType = settings.responseType;

			// Add headers
			for (var header in settings.headers) {
				if (settings.headers.hasOwnProperty(header)) {
					request.setRequestHeader(header, settings.headers[header]);
				}
			}

			// Set timeout
			if (settings.timeout) {
				request.timeout = settings.timeout;
				request.ontimeout = function (e) {
					reject({
						status: 408,
						statusText: 'Request timeout'
					});
				};
			}

			// Add withCredentials
			if (settings.withCredentials) {
				request.withCredentials = true;
			}

			// Send the request
			request.send(param(settings.data));

		});

		// Cancel the XHR request
		xhrPromise.cancel = function () {
			request.abort();
		};

		// Return the request as a Promise
		return xhrPromise;

	};

	/**
	 * Instatiate Atomic
	 * @param {String} url      The request URL
	 * @param {Object} options  A set of options for the request [optional]
	 */
	var Atomic = function (url, options) {

		// Check browser support
		if (!supports()) throw 'Atomic: This browser does not support the methods used in this plugin.';

		// Merge options into defaults
		settings = extend(defaults, options || {});

		// Make request
		return makeRequest(url);

	};


	//
	// Public Methods
	//

	return Atomic;

}));

/*! atomicjs v4.4.0 | (c) 2019 Chris Ferdinandi | MIT License | https://github.com/cferdinandi/atomic */
!(function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.ES6Promise=e()})(this,(function(){"use strict";function t(t){return"function"==typeof t}var e=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},n=0,r=void 0,o=void 0,i=function(t,e){h[n]=t,h[n+1]=e,2===(n+=2)&&(o?o(p):m())};var s="undefined"!=typeof window?window:void 0,u=s||{},a=u.MutationObserver||u.WebKitMutationObserver,c="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),f="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function l(){var t=setTimeout;return function(){return t(p,1)}}var h=new Array(1e3);function p(){for(var t=0;t<n;t+=2){(0,h[t])(h[t+1]),h[t]=void 0,h[t+1]=void 0}n=0}var d,v,y,_,m=void 0;function w(t,e){var n=this,r=new this.constructor(A);void 0===r[g]&&J(r);var o=n._state;if(o){var s=arguments[o-1];i((function(){return N(o,r,s,n._result)}))}else R(n,r,t,e);return r}function b(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(A);return P(e,t),e}c?m=function(){return process.nextTick(p)}:a?(v=0,y=new a(p),_=document.createTextNode(""),y.observe(_,{characterData:!0}),m=function(){_.data=v=++v%2}):f?((d=new MessageChannel).port1.onmessage=p,m=function(){return d.port2.postMessage(0)}):m=void 0===s&&"function"==typeof require?(function(){try{var t=Function("return this")().require("vertx");return void 0!==(r=t.runOnLoop||t.runOnContext)?function(){r(p)}:l()}catch(t){return l()}})():l();var g=Math.random().toString(36).substring(2);function A(){}var T=void 0,j=1,x=2,S={error:null};function O(t){try{return t.then}catch(t){return S.error=t,S}}function C(e,n,r){n.constructor===e.constructor&&r===w&&n.constructor.resolve===b?(function(t,e){e._state===j?M(t,e._result):e._state===x?q(t,e._result):R(e,void 0,(function(e){return P(t,e)}),(function(e){return q(t,e)}))})(e,n):r===S?(q(e,S.error),S.error=null):void 0===r?M(e,n):t(r)?(function(t,e,n){i((function(t){var r=!1,o=(function(t,e,n,r){try{t.call(e,n,r)}catch(t){return t}})(n,e,(function(n){r||(r=!0,e!==n?P(t,n):M(t,n))}),(function(e){r||(r=!0,q(t,e))}),t._label);!r&&o&&(r=!0,q(t,o))}),t)})(e,n,r):M(e,n)}function P(t,e){var n,r;t===e?q(t,new TypeError("You cannot resolve a promise with itself")):(r=typeof(n=e),null===n||"object"!==r&&"function"!==r?M(t,e):C(t,e,O(e)))}function E(t){t._onerror&&t._onerror(t._result),F(t)}function M(t,e){t._state===T&&(t._result=e,t._state=j,0!==t._subscribers.length&&i(F,t))}function q(t,e){t._state===T&&(t._state=x,t._result=e,i(E,t))}function R(t,e,n,r){var o=t._subscribers,s=o.length;t._onerror=null,o[s]=e,o[s+j]=n,o[s+x]=r,0===s&&t._state&&i(F,t)}function F(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,s=0;s<e.length;s+=3)r=e[s],o=e[s+n],r?N(n,r,o,i):o(i);t._subscribers.length=0}}function N(e,n,r,o){var i=t(r),s=void 0,u=void 0,a=void 0,c=void 0;if(i){if((s=(function(t,e){try{return t(e)}catch(t){return S.error=t,S}})(r,o))===S?(c=!0,u=s.error,s.error=null):a=!0,n===s)return void q(n,new TypeError("A promises callback cannot return that same promise."))}else s=o,a=!0;n._state!==T||(i&&a?P(n,s):c?q(n,u):e===j?M(n,s):e===x&&q(n,s))}var H=0;function J(t){t[g]=H++,t._state=void 0,t._result=void 0,t._subscribers=[]}var L=(function(){function t(t,n){this._instanceConstructor=t,this.promise=new t(A),this.promise[g]||J(this.promise),e(n)?(this.length=n.length,this._remaining=n.length,this._result=new Array(this.length),0===this.length?M(this.promise,this._result):(this.length=this.length||0,this._enumerate(n),0===this._remaining&&M(this.promise,this._result))):q(this.promise,new Error("Array Methods must be provided an Array"))}return t.prototype._enumerate=function(t){for(var e=0;this._state===T&&e<t.length;e++)this._eachEntry(t[e],e)},t.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===b){var o=O(t);if(o===w&&t._state!==T)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===U){var i=new n(A);C(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(r(t),e)},t.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===T&&(this._remaining--,t===x?q(r,n):this._result[e]=n),0===this._remaining&&M(r,this._result)},t.prototype._willSettleAt=function(t,e){var n=this;R(t,void 0,(function(t){return n._settledAt(j,e,t)}),(function(t){return n._settledAt(x,e,t)}))},t})();var U=(function(){function t(e){this[g]=H++,this._result=this._state=void 0,this._subscribers=[],A!==e&&("function"!=typeof e&&(function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")})(),this instanceof t?(function(t,e){try{e((function(e){P(t,e)}),(function(e){q(t,e)}))}catch(e){q(t,e)}})(this,e):(function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")})())}return t.prototype.catch=function(t){return this.then(null,t)},t.prototype.finally=function(t){var e=this.constructor;return this.then((function(n){return e.resolve(t()).then((function(){return n}))}),(function(n){return e.resolve(t()).then((function(){throw n}))}))},t})();return U.prototype.then=w,U.all=function(t){return new L(this,t).promise},U.race=function(t){var n=this;return e(t)?new n(function(e,r){for(var o=t.length,i=0;i<o;i++)n.resolve(t[i]).then(e,r)}):new n(function(t,e){return e(new TypeError("You must pass an array to race."))})},U.resolve=b,U.reject=function(t){var e=new this(A);return q(e,t),e},U._setScheduler=function(t){o=t},U._setAsap=function(t){i=t},U._asap=i,U.polyfill=function(){var t=void 0;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var n=null;try{n=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===n&&!e.cast)return}t.Promise=U},U.Promise=U,U})),(function(t,e){"function"==typeof define&&define.amd?define([],(function(){return e(t)})):"object"==typeof exports?module.exports=e(t):window.atomic=e(t)})("undefined"!=typeof global?global:"undefined"!=typeof window?window:this,(function(t){"use strict";var e,n={method:"GET",username:null,password:null,data:{},headers:{"Content-type":"application/x-www-form-urlencoded"},responseType:"text",timeout:null,withCredentials:!1},r=function(){for(var t={},e=function(e){for(var n in e)e.hasOwnProperty(n)&&("[object Object]"===Object.prototype.toString.call(e[n])?t[n]=r(t[n],e[n]):t[n]=e[n])},n=0;n<arguments.length;n++){e(arguments[n])}return t},o=function(t){var n=new XMLHttpRequest,r=new Promise(function(r,o){for(var i in n.onreadystatechange=function(){4===n.readyState&&(n.status>=200&&n.status<300?r(function(t){var n;if("text"!==e.responseType&&""!==e.responseType)return{data:t.response,xhr:t};try{n=JSON.parse(t.responseText)}catch(e){n=t.responseText}return{data:n,xhr:t}}(n)):o({status:n.status,statusText:n.statusText,responseText:n.responseText}))},n.open(e.method,t,!0,e.username,e.password),n.responseType=e.responseType,e.headers)e.headers.hasOwnProperty(i)&&n.setRequestHeader(i,e.headers[i]);e.timeout&&(n.timeout=e.timeout,n.ontimeout=function(t){o({status:408,statusText:"Request timeout"})}),e.withCredentials&&(n.withCredentials=!0),n.send(function(t){if("string"==typeof t||"[object FormData]"===Object.prototype.toString.call(t))return t;if(/application\/json/i.test(e.headers["Content-type"])||"[object Array]"===Object.prototype.toString.call(t))return JSON.stringify(t);var n=[];for(var r in t)t.hasOwnProperty(r)&&n.push(encodeURIComponent(r)+"="+encodeURIComponent(t[r]));return n.join("&")}(e.data))});return r.cancel=function(){n.abort()},r};return function(i,s){if(!("XMLHttpRequest"in t&&"JSON"in t&&"Promise"in t))throw"Atomic: This browser does not support the methods used in this plugin.";return e=r(n,s||{}),o(i)}}));