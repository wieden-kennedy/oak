Oak
===
Oak is a general purpose javascript framework that was built with a single concept in mind. In order to use javascript you must know how to javascript.

Oak's intentions are to give you low level access to your source while giving you conveniences typical of high level frameworks.

It's goal is to make your javascipt DRY and performant. It is not intended for beginners.

## A few cool things you can do with oak
Run operations on collections (we call these straps)

```
// Manipulate a collection of dom elements
var myCollection = oak.strap("li");
li.css("color", "#FFF");

// Manipulate a collection of objects
var
    obj1 = {x: 100, y: 400},
    obj2 = {x: 150, y: -20},
    obj3 = {x: 400, y: 0};
var myObjCollection = oak.strap(obj1, obj2, obj3);
myObjCollection.set("x", 200);
```

Extend oak's strappable functions
```
oak.expose({
    dogify: function (strap) {
        return strap.each(function (str) {
            if (oak.isString(str)) {
                str += ", sup dog.";
            });
        });
    }
});
var names = ["Carl", "Justin", "Lindsey"].strap();
names.dogify();

// Outputs "Carl, sup dog."
console.log(names[0]);
```
Check for supported properties
```
if (oak.support.cssanimations) {
    // Do something
}
```

Animate using css
```
oak.animate(myDiv, {
    easing: oak.timing.EasInOut,
    duartion: 500,
    backgroundColor: "#FFF",
    transform: "translate3d(100px, 300px, 4000px)",
    onComplete: function () {
        console.log("complete");
    }
});
```

## Getting Started
Oak is broken up into functional packages that can be installed with bower.

### Installing with bower


```
npm install -g bower
bower install oak
```

This will install the oak core package. If you want to use any of the other packages you must install them separately.

```
bower install oak-animate
bower install oak-canvas
bower install oak-data
bower install oak-dom
bower install oak-router
bower install oak-tween
...
```

*Alternatively the minified source for each package can be found in its' repositories build directory.*

Documentation
-------------
http://maxfolley.gitbooks.io/oak-docs/content/


Running Tests
-------
In order to run the tests you mast have [PhantomJS](http://phantomjs.org/) installed. You can install it globally via NPM.

		$ npm install phantomjs -g
