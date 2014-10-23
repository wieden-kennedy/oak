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
