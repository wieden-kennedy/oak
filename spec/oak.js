"use strict";

//var oak = require('../src/core');
describe("oak", function () {

  it("should exist", function () {
    expect(oak).toBeDefined();
  });

  it("should extend oak namespace", function () {
    var self = {foo: "bar"};
    oak.core.extend(self);
    expect(oak.foo).toBe("bar");
  });

  it("should strap multiple objects", function () {
    var strap = oak.strap({}, {}, {});
    expect(strap.length).toBe(3);
  });

  describe('method: defined', function () {
    it('returns true for a defined argument', function () {
      var defined = true;
      expect(oak.defined(defined)).toBe(true);
    });

    it('returns false for an undefined argument', function () {
      var defined;
      expect(oak.defined(defined)).toBe(false);
    });

    it('accepts multiple arguments', function () {
      var defined1 = true,
          defined2 = false,
          func = function () {
            oak.defined(defined1, defined2);
          };
      expect(func).not.toThrow();
    });

    it('returns false if any one of its arguments is undefined', function () {
      var defined1 = true,
          defined2,
          defined3 = false;
      expect(oak.defined(defined1, defined2, defined3)).toBe(false);
    });

    it('returns true if all of its arguments are defined', function () {
      var defined1 = true,
          defined2 = false,
          defined3 = true;
      expect(oak.defined(defined1, defined2, defined3)).toBe(true);
    });

  });
  describe('method: exists', function () {
    it('returns true for a defined argument', function () {
      var test = true;
      expect(oak.exists(test)).toBe(true);
    });

    it('returns true for a truthy argument', function () {
      var test = 1;
      expect(oak.exists(test)).toBe(true);
    });

    it('returns false for an undefined argument', function () {
      var test;
      expect(oak.exists(test)).toBe(false);
    });

    it('returns false for a falsy argument', function () {
      var test1 = false,
        test2 = 0,
        test3 = null;
      expect(oak.exists(test1)).toBe(false);
      expect(oak.exists(test2)).toBe(false);
      expect(oak.exists(test3)).toBe(false);
    });

    it('allows for multiple arguments', function () {
      var test1 = true,
        test2 = 1,
        test3,
        func = function () {
          oak.exists(test1, test2, test3);
        };
      expect(func).not.toThrow();
    });

    it('returns true if all arguments are defined and/or truthy', function () {
      var test1 = true,
        test2 = 1,
        test3 = {};
      expect(oak.exists(test1, test2, test3)).toBe(true);
    });

    it('returns false if any one of its arguments are undefined and/or falsy',
      function () {
        var test1 = true,
          test2 = false,
          test3;
        expect(oak.exists(test1, test2, test3)).toBe(false);
    });
  });

  describe('method: isArray', function () {
    
    it('returns ture if the argument is an array', function () {
      var a = [0, 1, 2, 3],
        b = [];
      expect(oak.isArray(a)).toBe(true);
      expect(oak.isArray(b)).toBe(true);
    });

    it('returns false if the arument is not an array', function () {
      var a = { a: 'b' },
        b = 1,
        c = 'string',
        d = null,
        e;
      expect(oak.isArray(a)).toBe(false);
      expect(oak.isArray(b)).toBe(false);
      expect(oak.isArray(c)).toBe(false);
      expect(oak.isArray(d)).toBe(false);
      expect(oak.isArray(e)).toBe(false);
    });

  });

  describe('method: isStrap', function () {
    var div, strap;
    beforeEach(function () {
      div = document.createElement('div');
      strap = oak.strap(div);
    });

    it('returns true if argument is an oak strap', function () {
      expect(oak.isStrap(strap)).toBe(true);
    });

    it('returns false if argument is not oak strap', function () {
      expect(oak.isStrap(div)).toBe(false);
    });
  });

  describe('strapped methods', function () {
    var collection, div;
    beforeEach(function () {
      div = document.createElement('div');
      div = oak.strap(div);
      collection = oak.strap();
      collection.add(["foo", "bar", "hello", "world"]);
    });
    
    describe('method: each', function () {
      it('should iterate all items', function () {
        var num = 0;
        collection.each(function (item) {
          num += 1;
        });
        expect(num).toBe(collection.length);
      });

      it('should iterate only colelction items', function () {
        collection.each(function (item) {
          expect(typeof item).toBe("string");
        });
      });
    });

    describe('method: splice', function () {
      it('should remove at index', function () {
        collection.splice(1, 1);
        expect(collection[1]).toBe("hello");
      });

      it('should set new length', function () {
        collection.splice(1, 1);
        expect(collection.length).toBe(3);
      });
    });

  });

  it('should allow for strapping through String prototype', function () {
    var myString = "#my-item";
    expect(myString.strap).toBeDefined();
  });

  it('should allow for strapping through Array prototype', function () {
    var myDiv = document.createElement("DIV");
    var myOtherDiv = document.createElement("DIV");
    var myArray = [myDiv, myOtherDiv];

    expect(myArray.strap).toBeDefined();

    var myStrap = myArray.strap();
    expect(myStrap).toBeDefined();
    expect(myStrap[0]).toBeDefined();
    expect(myStrap.length).toBe(2);
  });

  it('should allow for strapping through HTMLElement prototype', function () {
    var myDiv = document.createElement("DIV");

    expect(myDiv.strap).toBeDefined();

    var myStrap = myDiv.strap();
    expect(myStrap).toBeDefined();
    expect(myStrap[0]).toBeDefined();
  });

});
