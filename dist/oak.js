// Bind polyfil
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// Authors 
// ---
// Maxwell Folley  
// David Glivar  
//
// Copyright
// ---------
// 2014 W+K 

/**
 * Oak core functions.
 * The core package contains functionality for strapping and extending objects using oak. It also supplies core
 * functionality necessary for other oak packages.
 * It also contains methods for you to extend the oak.strap and oak.core namespaces.
 * @class oak.core 
 * @example
 * var set = oak.strap([
 *  100,
 *  200,
 *  300
 * ]);
 * set.each(function (num, index) {
 *   console.log(num, index);
 * });
 * 
 */
window.oak = this.oak = (function () {

  "use strict";
  var VERSION = "1.0.0", 
    modules = {},
    // o is used to set oak properties 
    o = {
      // Oak vars intended to be used privately, prepend with an underscore
      _identifier: /^#[a-zA-Z\-_]+$/,
      _splitter: /\s+/,
      // Save out prototypes for easy acces and smaller file size
      _arrProto: Array.prototype,
      _funcProto: Function.prototype,
      _objProto: Object.prototype,
      _strProto: String.prototype,
      // Easily iterate through an array or object 
      each: function (stack, iterator, context)  {
        // Use Array.forEach
        if (o._arrProto.forEach && stack.forEach === o._arrProto.forEach) {
          return stack.forEach(iterator, context);
        // Fallback when native Array.forEach is not available (< ie 8)
        } else if (stack.length) {
          var i, len = stack.length;
          for (i = 0; i < len; i += 1) {
            if (iterator.call(context, stack[i], i, stack) === {}) {
              return;
            }
          }
        // Loop an Object
        } else {
          var key;
          for (key in stack) {
            if (o._objProto.hasOwnProperty.call(stack, key)) {
              if (iterator.call(context, stack[key], key, stack) === {}) {
                return;
              }
            }
          }
        }
      },
      // Defined 
      // ------
      // Helper to check defined arguments
      // If all defined it returns true
      // If any aren't defined, it returns false.
      // E.g. if (oak.defined(myVar, yourVar)) {};
      defined: function () {
        var i, args = o._arrProto.slice.call(arguments, 0), numArgs = args.length;
        for (i = 0; i < numArgs; i += 1) {
          if (typeof args[i] === "undefined") {
            return false;
          }
        }
        return true;
      },
      // Exists
      // ------
      // Helper to check if variables exist
      // If undefined, null, false, or 0 it will return false
      exists: function () {
        var i, args = o._arrProto.slice.call(arguments, 0), numArgs = args.length;
        for (i = 0; i < numArgs; i += 1) {
          if (typeof args[i] === "undefined" || !args[i]) {
            return false;
          }
        }
        return true;
      },

      // Copy contents of source objects into the target object
      // oak.extend(target, *sources);
      extend: function (targ) {
        var args = o._arrProto.slice.call(arguments, 1);
        o.each(args, function(src) {
          if (src) {
            for (var prop in src) {
              targ[prop] = src[prop];
            }
          }
        });
        return targ;
      },
      isArray: Array.isArray || function (val) {
        return o._objProto.toString.call(val) === "[object Array]";
      },
      isElement: function (val) {
        return val instanceof HTMLElement;
      },
      // Checks if an object has any properties
      isEmpty: function(val) {
        if (val == null) {
          return true;
        } else if (o.isArray(val) || o.isString(val)) {
          return val.length === 0;
        }
        for(var prop in val) {
          if (o._objProto.hasOwnProperty.call(val, prop)) {
            return false;
          }
        }
        return true;
      },
      isNode: function (val) {
        return val.nodeType === 1;
      },
      isStrap: function (val) {
        return modules.core.prototype.isPrototypeOf(val);
      },
      // A private key used to store information for this session
      privateKey: "oak" + (VERSION + Math.random()).replace(/\D/g, "")
    };

  function expose(val) {
    for (var key in val) {
      modules.core.prototype[key] = val[key];
    }
  }

  // Allow us to pass collection items into the constructor
  // I.e. new modules.core(1, 2, 3);
  modules.core = function () {
    //this.push.apply(this, arguments);
  };

  modules.core.prototype = {
    // add
    // ---
    // Add an item or array of items to a collection
    add: function (val) {
      if (val.length) {
        var i, l = val.length;
        for (i = 0; i < l; i += 1) {
          this.push(val[i]);
        }
      } else {
        this.push(val);
      }
      return this;
    },
    // each
    // --------
    // Convenience method for looping an oak collection 
    each: function (iterator, context) {
      o.each(this, iterator, context);
      return this;
    },
    // extend
    // ----------
    // Allows any object to be extended with the properties of the
    // first param.
    // @params
    // target - object being extended.
    // src - one or many objects that contain properties to override the target values.
    extend: function () {
      var args = [this].concat(o._arrProto.slice.call(arguments, 0));
      o.extend.apply(o, args);
      return this;
    },
    push: o._arrProto.push,
    splice: o._arrProto.splice
  };

  // oak.strap
  // ---------
  // Returns a bootstrapped obejct.
  // The object will have any function assigned to the methods object,
  // and those methods will use the obj param as the scope.
  // Can take 2 params. First param can either be a string to query
  // the dom for or a strapped object. If it's a strapped object it will
  // query the collection in that object using the second param, which oak
  // expects to be a string. If no params, it returns a strapped object with
  // an empty collection.
  //
  // Alternatively, the strap method can take an unlimited number of params
  // as long as each one is a dom element it will be pushed into the 
  // strapped collection.
  o.strap = function (val, opts) {
    var collection,
        strap = new modules.core();
    // If a string, find the element or elements
    if (oak.isString(val)) {
      // Finding by ID is faster than querySelectorAll
      if (o._identifier.test(val)) {
        strap[0] = document.getElementById(val.substr(1));
        strap.length = 1;
      } else {
        var result = document.querySelectorAll(val);
        if (result.length) {
          strap.add(document.querySelectorAll(val));
        }
      }
    } else if (o.defined(val) && o.defined(val.find, opts) && typeof opts === "string") {
      return val.find(opts);
    // Adds all the arguments to the collection 
    } else if (arguments.length) {
      strap.add(o._arrProto.slice.call(arguments, 0));
    }

    // Returns a beefed up array 
    return strap;
  };

  // Core object allows us to extend the oak namespace 
  // Use expose to expose methods to strappable collections
  // Use extend to add methods to the oak core
  o.core = {
    // When extending core, it attaches it to the oak namespace
    extend: function () {
      var args = [o].concat(o._arrProto.slice.call(arguments, 0));
      o.extend.apply(o, args); 
    },
    expose: expose
  };

  o.each(["Arguments", "Date", "Function", "Number", "RegExp", "String"], function (name) {
    o["is" + name] = function (val) {
      return o._objProto.toString.call(val) === "[object " + name + "]";
    };
  });

  // allow for [myel, header].strap() syntax 
  o._arrProto.strap = function () {
    return o.strap.apply(null, this);
  };

  // allow for "header".strap() syntax 
  o._strProto.strap = function (opts) {
    return o.strap(this, opts);
  };

  HTMLElement.prototype.strap = function () {
    return o.strap(this);
  };

  // AMD definition for use with AMD loaders 
  if (typeof define === "function" && define.amd) {
    define(o);
  }
  
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = o;
    }
    exports.oak = o;
  }

  return o;
}());

(function (o) {
  "use strict";

  var self = {},
      _caf, 
      _lastTime = 0,
      _prefixes = o.support.prefixes,
      _raf;
  
  if (window.requestAnimationFrame) {
    _raf = window.requestAnimationFrame;
  } else {
    for(var i = 0; i < _prefixes.length && !self.requestAnimationFrame; i += 1) {
      _raf = window[_prefixes[i] + "RequestAnimationFrame"];
      _caf = window[_prefixes[i] + "CancelAnimationFrame"] || 
             window[_prefixes[i] + "CancelRequestAnimationFrame"];
    }
  }

  if (_caf) {
    self.caf = function () {
      _caf.apply(window, arguments);
    };
  } else {
    self.caf = function(id) {
      clearTimeout(id);
    };
  }

  if (_raf) {
    self.raf = function () {
      _raf.apply(window, arguments);
    };
  } else {
    self.raf = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - _lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      _lastTime = currTime + timeToCall;
      return id;
    };
  }

  o.core.extend(self);

}(oak));
