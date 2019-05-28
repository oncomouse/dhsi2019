# Day 1 – Working w/ an IDE and ES 2015

## Visual Studio Code: Our IDE

We will be using Microsoft's [Visual Studio Code](https://code.visualstudio.com/). Code is an open-source IDE (integrated development environment) for many languages. It offers a lot of support for working with advanced JavaScript out-of-the-box.

### Getting Started

VS Code is very customizable. If you want to, you can change the font (I use the [Fira Code Nerd Font](https://nerdfonts.com/)) and set or install a different color theme (I use "Oceanic Next").

Once you have a font you like and a color scheme, if you want it, you can get started working.

### Installing Extensions

In addition to customizing the appearance and behavior of the application, VS Code has an Extension market that adds functionality to the editor.

While there are no required extensions for this class, I would recommend installing "ESLint" into your VS Code. The wi-fi might be slow in our classroom, and we won't be using our linter until tomorrow, so you could install it tonight.

To do so, click on the "Extension" icon or use the shortcut (<kbd>⇧+⌘+X</kbd> on Mac; <kbd>⇧+^+X</kbd> on Windows) to open the Extension market. Search for "eslint" and install the "ESLint" package (it's written by Dirk Baeumer and version 1.8.2, currently). Click the green "Install" button and the extension will download and install.

### Opening Our Project

Hopefully before class, you downloaded the .ZIP file with our project boilerplate code. If you've extracted it, open the directory in VS Code (`File -> Open`). If you've not extracted or downloaded, download and extract the .ZIP file and open it in VS Code.

In the side bar of your app, there are five icons:

1. Project Explorer
1. Search Project
1. Source Control
1. Debug
1. Extensions (which we've already used).

We will be using the "Project Explorer" tab a lot. The shortcut is <kbd>⇧+⌘+E</kbd> on Mac; <kbd>⇧+^+E</kbd> on Windows. Here we can see all the files and directories in our project and create new ones as well.

### Accessing Terminal

We will also need to use a terminal often. Thankfully, Code has a built in terminal display. In the menu, `View->Terminal` will open a command line in your current project. We will use this to run Node.js and, tomorrow, to start our first React app's development server.

## The Lazy Programmer's Friend: Don't Repeat Yourself (DRY)

First introduced in *The Pragmatic Programmer* (1999) by Andrew Hunt and David Thomas, "Don't Repeat Yourself" (DRY) has become a bit of a motto in software design conversations. Hunt and Thomas define DRY with the following axiom:

> Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.

In effect, this means never having the same thing expressed in more than one place. If you change the piece of knowledge and it exists in more than one place, you have to change it everywhere.

At a basic level, DRY covers something such as the following:

~~~javascript
/**
 * Detect if an object has a given key
 *
 * @param object - a JavaScript object
 * @param key - a key the object might have
 *
 * @return Boolean - true if the key is present; false if not
 */
function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

function test(testObj) {
  if (!has(testObj, 'name') {
    throw new Error('The object is missing the key "name"');
  }
  if (!has(testObj, 'email') {
    throw new Error('The object is missing the key "email"');
  }
  if (!has(testObj, 'age') {
    throw new Error('The object is missing the key "age"');
  }
  if (!has(testObj, 'hometown') {
    throw new Error('The object is missing the key "hometown"');
  }
}
~~~

The above code is perfectly fine. It tests is four required keys are present on a supplied object, throwing an Error if any of the keys are missing.

However, what happens if we change something? Say we want the function to return true if the object passes and false if it is missing a key? Or we need to use a different test for object key presence?

We have to rewrite four tests. And while that stinks, it's not the end of the world. On the one hand, this code is offensive because automating repetitive things is one of the main advantages of computing. On the other, and perhaps more important, what if this test logic was split across multiple files in a very large application codebase. Would we even be able to find all the instance to fix?

Instead, consider this much more DRY friendly method:

~~~javascript
function test(testObj) {
  var keys = ['name', 'email', 'age', 'hometown'];
  for(var i=0; i < keys.length; i++) {
    if(!has(testObj, keys[i]) {
      throw new Error('The object is missing the key "' + key + '"');
    }
  }
}
~~~

Now, to add or remove keys, we have to alter the array declaring what we are testing for. To alter the test itself, we have to change one if statement. To alter the behavior on error, we have to alter the single throw statement. This code is much more manageable (we'll talk later about why it's still not as manageable as it could be).

From this first principle, DRY has extended to encompass an entire ethos of application development. As an example from this week, in React forms are difficult to handle: React has a very specific way to manage form data and it expects you to rigorously follow it. As such, there are a number of libraries that automate form creation in React. So, to follow DRY principles, we can use something like that (or write our own if the ones available don't meet our needs). Now, we have abstracted some repetitive form logic to another library.

There is a wealth of tools available to JavaScript and CSS programmers to help with the process of developing DRY code. However, throughout the week, be looking out for moments of repetition or times when you find yourself typing the same or very similar code over and over again. If you see this happening, ask yourself: can I abstract the general principle of this? Can I not repeat myself?

* [A detailed explanation of DRY and the many gotchas associated with it](https://thevaluable.dev/dry-principle-explained/)

## What Things Do You Need to Learn React?

### Scope and Closures

Consider these two examples in JavaScript:

~~~javascript
function foo(bar) {
  hello += bar;
}

var hello = 'hello';
foo(', class');
console.log(hello); // What happens here?
~~~

vs.

~~~javascript
function foo(bar) {
  var hello = 'hello';
  hello += bar;
  return hello;
}

var hello = 'hello';
foo(', class');
console.log(hello) // What happens here?
~~~

Why do they behave differently?

Variables in JavaScript exist in a particular scope. There is a **global scope**, defined for a single page or a single session in Node. Additional scopes are defined in JavaScript by **closures**. Closures are anything contained within braces, so functions, if statements, loops, anything like that.

Variables have to be declared locally in a scope (using `var` (or `let` / `const`, which we'll talk about in a second)). If two variables of the same name exist in two different scopes, the narrower one takes precedent. This is why the second function does not change our global variable.

Consider:

~~~javascript
var name = 'Amanda';
function doSomethingWithName() {
  var name = 'Susan';
  if(true) {
  var name = 'Beth';
    return name;
  }
}
console.log(doSomethingWithName()); // Prints "Beth"
~~~

We define variables named `name` in three increasingly narrow scope. This is valid JavaScript, though please *never* write code like this.

*Note: We'll be working with a [linter](https://en.wikipedia.org/wiki/Lint_(software)) in future meetings of our course; ESLint can be configured (and is in the setup we will be using) to flag situations like the one above as errors.*

[Self-executing anonymous functions](http://markdalgleish.com/2011/03/self-executing-anonymous-functions/) have been a historic solution to the problem of global scope collision in JavaScript. Later in the course, we will be using a module loader to solve this. At this point, be aware that assigning things to the global scope can be a problem.

### `const` vs `let`

JavaScript recently introduced two new ways to define variables: `const` and `let`. `const` defines constant variables that may never be reassigned after their initial assignment. Variables defined with `let` may be reassigned.

Note that, as we'll see below, a `const` can be changed just so long as it isn't reassigned.

~~~javascript
const foo = 'foo';
let bar = 'bar';

foo += 'bar'; // ERROR
bar = 'foo' + bar; // works!
~~~

What about this?

~~~javascript
const arr = [1, 2, 3];

arr.push(4);
console.log(arr) // [1, 2, 3, 4]
~~~

As long as you don't use reassignment (`=`, but also `+=` or `++` operators), you can alter the contents of a `const`.

JavaScript engines will eventually optimize constant variables (because they never get updated), so use `const` whenever possible (which should be most situations).

If you find yourself using `let` to define variables, try to refactor your code.

### Big Arrow Functional Notation

~~~javascript
function reducer (state, action) {
  return action.type === 'test' ? state.filter(item => item.updated === false) : state;
}
~~~

~~~javascript
const reducer = (state, action) => action.type === 'test' ? state.filter(item => item.updated === false) : state;
~~~

This is called big arrow notation.

Why do this?

* Functions translate parameters into output
* Big arrow notation focuses on that behavior
* Simplify syntax for [higher order functions](https://en.wikipedia.org/wiki/Higher-order_function)

#### Higher-Order Functions

Two examples:

~~~javascript
function applyTwice(f, x) {
  return f(f(x));
}

applyTwice(function (x) {
  return x + 1;
}, 1); // 3
~~~

~~~ javascript
const applyTwice = (f, x) => f(f(x));
applyTwice(x => x + 1, 1); 
~~~

~~~javascript
function greetingFactory(greeting) {
  return function(name) {
    return greeting + ', ' + name;
  }
}

// Usage examples:
const sayHello = greetingFactory('Hello');
console.log(sayHello('Jane')) // Hello, Jane
const diHola = greetingFactory('Hola');
console.log(diHola('Jane')) // Hola, Jane
~~~

~~~javascript
const greetingFactory = greeting => name => greeting + ', ' + name;
~~~

### Functional Array Transformations

Now that we know big arrow functional notation, let's see some built-in, higher-order functions that can be used to transform arrays in JavaScript (which is something we're going to be doing a lot of).

#### `.map()`

How can we add one to each value in an array of numbers?

~~~javascript
const addOne = array => array.map(item => item + 1);
~~~

`Array.map()` applies a function to each member of an array and returns a new array composed of these function results.

#### `.reduce()`

How can we find the highest number in an array of numbers?

~~~javascript
const highestNumber = array => array.reduce((highest, item) => item > highest ? item : highest, -Infinity);
~~~

`Array.reduce()` applies a function to each member of an array along with either a supplied starting value or the result of the previous function call. The final return value is the last function return.

Reduce is used to convert an array into a single value. We could calculate the length of an array using `.reduce()`, if we wanted:

~~~javascript
const length = array => array.reduce(length => length + 1, 0);
~~~

*Hint: Don't ever do this. The `.length` property (`[1,2,3].length`) contains an array's length.*

##### `.reduceRight()`

Sometimes you need to go end to front on an array. If so, use `.reduceRight()` instead of `.reduce()`.

#### `.filter()`

How do we remove negative numbers from an array of numbers?

~~~javascript
const removeNegative = array => array.filter(item => item > 0);
~~~

`Array.filter()` applies a function to each member of an array. This function *must* return a boolean value (`true` or `false`). The return value of filter is the members of the array for whom the function returns `true`.

### Spread Notation

One new feature in JavaScript is called spread notation. Spread lets you treat a variable containing an array or an object as a list of values. As a quick example, say we had a function that takes three values and we wanted to pass the three values from an array to it as arguments:

~~~javascript
const addThreeNumbers = (a, b, c) => a + b + c;

const args = [1, 2, 3];
~~~

How can we pass `args` to `addThreeNumbers`?

The least efficient way would be:

~~~javascript
addThreeNumbers(args[0], args[1], args[2]);
~~~

But functions in JavaScript can accept a variable number of parameters, so that will only work in limited situations.

The old way to do this in JavaScript is:

~~~javascript
addThreeNumbers.apply(null, args);
~~~

This uses a member property of the `Function` object (functions are objects in JavaScript) called `apply` that converts an array into all the parameters of a function. There is a related member property called `call` that calls a function with each argument passed as a parameter.

*Note: the `null` in `apply` is because the first parameter to `apply` and `call` takes the place of a function's `this` argument.*

Here's an example using spread:

~~~javascript
addThreeNumbers(...args);
~~~

This gets us out of having to remember the difference between `apply` and `call`, but, more importantly, spread notation has a lot of other applications.

#### Array Spread

How do we create a copy of an array and add an item to the end?

~~~javascript
const addToEnd = (array, item) => array.slice().concat(item);
~~~

OR

~~~javascript
const addToEnd = (array, item) => ([ ...array, item ]);
~~~

#### Object Spread

How do we return a copy of an object with one property altered?

~~~javascript
// Source: https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, attr)) copy[attr] = obj[attr];
  }
  return copy;
}

const set = (object, key, value) => {
  const copyObject = clone(object);
  copyObject[key] = value;

  return copyObject;
}
~~~

OR

~~~javascript
const set = (object, key, value) => ({
  ...object,
  [key]: value
});
~~~

Why do we need parentheses around the return value of `set`?

### Template Strings

Consider again our `greetingFactory` function:

~~~javascript
const greetingFactory = greeting => name => greeting + ', ' + name;
~~~

Having to add bits of a string together is a pain. In ES2015, you can use what's called a template literal to streamline this:

~~~javascript
const greetingFactory = greeting => name => `${greeting}, ${name}`;
~~~

Template strings can also be multiline:

~~~javascript
const multilineGreeting = greeting => name => `${greeting},
${name}`;
~~~

You can also use function calls or any other operations inside the templates:

~~~javascript
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
const capitalizedGreeting = greeting => name => `${capitalize(greeting)}, ${name}`;
~~~

### External Libraries

While you still can't officially do this in the browser, Node.js introduces the ability to require data from external libraries and script files you define. Additionally, when we start working with our React app boilerplate, we can use a similar syntax in our web applications.

In addition to `node`, the Node.js package installs `npm`, which is a package manager. If you run `npm install jquery`, you can install jQuery into your application. This is how we will install all external libraries going forward.

#### `require`

In Node.js (or any server-side code designed to be run by Node), you can use the `require()` function to include libraries.

We installed jQuery above. To use it (though it won't work outside a browser), in Node.js, we could run:

~~~javascript
const $ = require('jquery');
~~~

If we wanted to use our `capitalize` function in other parts of our program, we could write a file called `capitalize.js` which would look like this:

~~~javascript
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

module.exports = {
  capitalize
};
~~~

In another file where we wanted to use `capitalize`, say a file named `main.js`, we could write:

~~~javascript
const { capitalize } = require('./capitalize');

console.log(capitalize('foobar'));
~~~

If we ran `node main`, we would get "foobar" printed to our command line.

#### `import` / `export`

This syntax is preferred in React applications. There are two kinds of exports in this standard, "named" and "default".

As an example, consider a file named `capitalized-greeting.js`:

~~~javascript
export const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const capitalizedGreeting = greeting => name => `${capitalize(greeting)}, ${name}`;

export default capitalizedGreeting;
~~~

In another file, if we wanted to include `capitalizedGreeting`, we could write:

~~~javascript
import capitalizedGreeting from './capitalized-greeting';
~~~

Here we are storing the default export from `capitalized-greeting.js` in a variable named `capitalizedGreeting`. We can name this variable whatever we want, as it is the default export.

If we wanted to import `capitalize`, we could write:

~~~javascript
import { capitalize } from './capitalized-greeting';
~~~

Here, we are storing capitalize in a variable named `capitalize`. Because this is a named export, we have to call the variable `capitalize`.

There is an exception:

~~~javascript
import { capitalize as capitalizeFunction } from './capitalized-greeting';
~~~

Now `capitalize` is in the variable `capitalizeFunction`.


Finally, we could also do:

~~~javascript
import capitalizedGreeting, { capitalize } from './capitalized-greeting';
~~~

This code imports both a default and a named export.

### Functional Composition

Continuing to think about higher-order functions, there's a trick in many functional languages called functional composition, that let's you chain the output of one function to the input of another. In this way, we can compose multiple simple functions into more complex solutions.

There isn't a native compose function in JavaScript, but we can add one to our application fairly easily:

~~~javascript
// Source: https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
~~~

Passing functions to compose will return a new function that performs each passed function (in right-to-left order) on a supplied input.

For instance:

~~~javascript
const doSomeMath = compose(x => x + 1, x => x * 2);
console.log(doSomeMath(4)); // What will this produce?
~~~

The above function will multiple it's argument by 2 and then add 1 (remember, we read the order of execution from right to left).

Composition is a useful way to compose and re-compose complex solutions using simple pieces.

A functional library such as [Ramda](https://ramdajs.com/) contains a series of utility functions that makes solving problems using `compose` easy. Ramda also contains a compose function.

With Ramda installed, in Node, we can do:

~~~javascript
const R = require('ramda');

const doSomeMath = R.compose(R.add(1), R.multiply(2));
~~~

You can also import Ramda functions individually (in certain applications this can be more efficient):

~~~javascript
import { compose, add, multiply } from 'ramda';

const doSomeMath = compose(add(1), multiply(2));
~~~

Our function composition works because functions in Ramda are [curried](https://en.wikipedia.org/wiki/Currying), which means that if they are run with fewer than the required arguments, they will return a function that will complete the operation when all arguments are supplied.

So, for instance, `R.add(1,2)` returns `3`, but `R.add(1)` returns a function that, when passed a number, returns `1+x`. So, in Ramda, `R.add(1,2)` is equivalent to `R.add(1)(2)`.

This works for any combination of arguments:

~~~javascript
const { curry } = require('ramda');

const add3 = curry((x, y, z) => x + y + z);

add3(1, 2, 3) === add3(1, 2)(3) === add3(1)(2, 3) === add3(1)(2)(3)
~~~

## Exercises!

To learn what we've done, take the last 45 minutes or so of class to work through some exercises designed to let you work with what we have learned.

You will probably need to use [Ramda](https://ramdajs.com/docs/) to complete, so make sure to check out the documentation!

If you want an extra special challenge, you can use Ramda to write all of these in point-free style (http://randycoulman.com/blog/2016/06/21/thinking-in-ramda-pointfree-style/), which is a way to earn some solid functional programming geek cred.

To see if your functions are working, run `npm run test` in the terminal in VS Code to start Jest, the testing framework installed in our demo application.

There is a stubbed file called `src/day01/exercises.js` that you can edit to include these functions.

### Lots of Smiles

Write a function named `lotsOfSmiles` (and `export` it) that takes an array of numbers and returns a string containing a number of smile emoji (😀) equal to the sum of all the numbers.

Some sample output:

* `[1, 2, 3] => "😀😀😀😀😀😀"`
* `[0] => ""`
* `[4, 5] => "😀😀😀😀😀😀😀😀😀"`

#### Questions to Consider

* How do we add together all the numbers in an array?
	* Check the Ramda docs, we may be able to DRY this one.
* How do we generate the emoji?
* How do we make everything into a string?

### Find the Longest Word in a Sentence

Write a function named `longestWord` (and `export` it) that takes a string as a parameter and returns the longest word in the sentence. If there are two or more words in the sentence of the same length, return the first alphabetically.

Here are some example outputs:

* `'This is a sentence' => 'sentence'`
* `'Equal word size' => 'Equal`
* `'Ignore comma.' => 'Ignore'`
* `'ignite Ignite' => 'ignite'`
	* (why is this important?)

#### Questions to Consider

* How do we extract words from a string?
	* We may need a Regular Expression for this
* How do we sort the words?
	* By length?
	* Alphabetically?

### Reverse Strings in an Array

Write a function named `reverseStrings` (and `export` it) that will take an array and will, for each string in the array, reverse the string. The function should not do anything to values that are not strings. Nor should it throw an Error if it encounters a string.

Here are some example outputs:

* `['bar', 'baz'] => ['rab', 'zab']`
* `[] => []`
* `[0, 1, 2] => [0, 1, 2]`
* `[0, 'foobar'] => [0, 'raboof']`

#### Questions to Consider

* How do you reverse a string?
* How do you detect if something is a string?
* How do we apply something to the whole of an array?
