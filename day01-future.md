# Day 01 - Thinking Functionally

JavaScript, the programming language that runs in your web browser, is derived from a programming language called [Scheme](https://www.cs.mcgill.ca/~rwest/wikispeedia/wpcd/wp/s/Scheme_programming_language.htm) though re-written with C-style syntax (which is commonly used in programming, languages such as Go and Java also derive from C syntax). Scheme is what is known as a "multi-paradigm programming language," which means that programs can be written in functional, object-oriented, or imperative style.

## Imperative? Functional?

There have been numerous paradigms in programming's history. A paradigm in this fashion is a way of solving a problem but also, more importantly, a set of axioms about what it is the programmer does to solve problems. For instance, object-oriented programming assumes programs are composed of a series of discreet objects who work together by exchanging messages to solve complex problems. Two of the oldest programming paradigms are imperative and functional programming.

**Imperative style** is perhaps the form of programming you are most familiar with, especially if you have programmed with a language such as Python. In such programs, each line is a step for the computer must take as it completes a given task. Imperative programs tell the computer what to do to solve a problem.

Suppose we wanted a program to print the numbers from 1 to 100. In JavaScript, we might write:

~~~javascript

for(let i = 1; i <= 100; i++) {
	console.log(i);
}
~~~

This is an imperative program. The program tells the computer: "Use a for loop; set an iterator variable I call to `i`; iterate until `i` is 100; after each iteration, add 1 to `i`; in each iteration, print `i` to the console" We are not telling the computer about the shape of the problem, we are giving it orders, hence imperative programming.

**Functional programming** is an equally old programming paradigm that utilizes functions chained together to describe how a problem is solved, with little recourse to the actual steps the computer takes to accomplish the work of each function. Functional programming has its roots in mathematics, specifically Alonzo Church's [Lambda Calculus](https://en.wikipedia.org/wiki/Lambda_calculus), and is considerably more abstract than imperative programming, however the advantage is a program becomes a description of how a problem would be solved rather than a series of steps for the computer to take.

Consider the same problem above as a functional solution:

~~~javascript
map(
	console.log,
	range(1, 101)
);
~~~

We have to know a little more information here to read this. **`map`** is a function that, when passed another function (`console.log` here) and a list as two arguments, applies that function to each member in an array. **`range`** is a function that returns an array of the numbers beginning with the first argument and ending before the second one.

In action, `map` converts:

~~~javascript
[1, 2, 3, 4, ..., 100] => [console.log(1), console.log(2), console.log(3), console.log(4), ..., console.log(100)]
~~~

How does the `map` function work internally? For that matter, how does `range` work internally? As a programmer, my answer is **`¯\_(ツ)_/¯`**. Don't know and don't care. That's the beauty of functional programming: I only have to know how to solve the problem, not what the computer actually does when it solves them. It splits the work up: I describe the problem; the computer does the work to solve it.

## Why Are You Telling Me This?

React, the front-end, data-driven, responsive web framework we are using in this class is based on functional principles, so understanding how a functional program works is useful for understanding what React is doing and what it is trying to do to us.

Before we get to that, we should understand some more about functions.

## What is a Function?

In computer programming a function (sometimes called a "method") is a bundle of code that is defined either by the language or by the programmer in order to perform the same steps multiple times. Moreover, functions take "arguments" and produce "output." If it helps, you can think of a function as a tool for converting a list of values ("arguments") into a single new value ("output"). In JavaScript, output is always a single value but functions can take any number of arguments.

### Arguments

When we called `range` above, we passed it two arguments (which are the values in the parentheses	after the name of the function): `0` and `101`. When we called `map` above, we also passed it two arguments: `console.log` and `range(0, 101)`. This works because, as I said above, functions return a single value, so our call to `map` is saying "Call `map` with `console.log` and the result of calling `range` with `0` and `101`." Function calls can be nested like this.

### Output

As we saw above, a function takes any number of arguments we want to pass it and returns a single value of output. This means that, as we saw above, we can use one function call as an argument to another. For instance, say we had functions called `add` and `subtract` that each take two arguments and return the result of adding and subtracing those two numbers. Consider:

~~~javascript
subtract((add(15, 20), add(4,1))
~~~

What's the result going to be? Well, to evaluate this like JavaScript, we would go left to right and inside to out. So, we would first need the arguments to `subtract`, so we would evaluate the left-most one and our `subtract` call would look like this:

~~~javascript
subtract(35, add(4,1))
~~~

That's looking a little less confusing, yes? Now we evaluate the next left-most argument to `subtract` and would get this:

~~~javascript
subtract(35, 5)
~~~

Now we can run our `subtract` function because we have no more functions in our arguments that need evaluating:

~~~javascript
30
~~~

And there's our answer! This nesting works as many levels deep as you want to go. What is the result of:

~~~javascript
add(subtract(20, add(3,5)), add(5, subtract(25,14)))
~~~

## Can *I* Write Functions?

You sure can!

There are two ways to write functions in JavaScript, the traditional way and the new way. The new way isn't completely supported in web browsers, but the environment in which we write our React code takes care of it for us.

### Defining a Function the Traditional Way

We've seen the function `add` above. If we tried to evaluate that trick example above in our browser's developer console, we'd get an error (`ReferenceError: add is not defined`) in return. That's just like The Man, isn't it?

Of course, we get that error because `add` and `subtract` are not functions included in JavaScript. We have to write them.

To define a function in JavaScript, you could type the following:

~~~
function add(num1, num2) {
	return num1 + num2;
}
~~~

There are a couple things worth noting here. `function` is a reserved word in JavaScript (which means you can't use it for variable names) that tells the language "Hey, I'm defining a new function here". The word `add` after `function` names the function, which defines how we are going to call our function. After the name, the words inside the parentheses name our paramters. **You can call these anything you want**, though it helps to name them something that will make future programmers not hate your guts.

I want to stress again, we define the names and number of parameters in our function. So, we could easily re-write `add` as:

~~~
function add(MarkTwain, TheTreatyOfTordesillas) {
	return MarkTwain + TheTreatyOfTordesillas;
}
~~~

And it would work the same (don't name your variables like this). When we define functions, we are in control of our parameter names.

The final thing to note is the `return` statement. `return` sets the output of the function. Here it is set to the first parameter added to the second parameter. Functions in JavaScript can have multiple `return` statements (inside of conditionals such as `if` statements). Functions in JavaScript can also have multiple lines that do not begin with `return`, in case your function has multiple steps.

There are some additional quarks in JavaScript that are not present in many other languages. In functional programming, **"arrity"** is used to refer to the number of arguments a function takes, such as 1-arrity, 2-arrity, etc. In many languages, the arrity of a function means that an error occurs if a function is called without the defined number of parameters. Because JavaScript loves watching you make mistakes, there is no arrity checking in JavaScript. You can run a function with as few or as many parameters as you want.

Consider:

~~~javascript

add()

// and

add(1, 2, 3, 4, 5)
~~~

The first call will return `NaN` because adding `undefined` and `undefined` produces the dreaded "Not a Number" number, `NaN`. It means an error occurred, but one that still looks like a number.

The second returns `3` because in our function definition, we only added the first two parameters. JavaScript is happy for you to pass as many arguments as you want, but it is only looking for two, so the rest just get thrown away.

### Anonymous Functions

In JavaScript, functions are first class!

While that sounds like a (bad) corporate slogan, it is also an important piece of computer science knowledge. First class functions mean that functions can be passed as parameters to other functions (which we already saw in `map`); it also means that functions can be stored in variables.

To get at the second of these two features, consider a re-definition of `add`:

~~~javacript
const add = function(num1, num2) {
	return num1 + num2;
}
~~~

The major change here is that instead of naming the function after the word `function`, we now name our function by storing it in a variable. We can still call `add(1, 2)` just like previously, but we have defined the name of the function differently.

To put things a bit more complexly, in the above example, we define an **"anonymous function"** and store it in the variable. Anonymous functions are unnamed. Here we give it a name when we store it in our variable, but with something like `map` we may want to pass a function to `map` but not store it in a separate variable or give it a name at all. We can use an anonymous function to define a function and pass it to `map` without ever storing it in memory.

Consider:

~~~javascript
map(
	function(x) { return x * 8 + 3; },
	[1, 2, 3, 4]
);
~~~

There, `map` will multiple each number in the list by 8 and add 3, resulting in `[11, 19, 27, 35]`. We only need that function for that one call to `map`, so we don't bother to give it a name. Anonymous functions are great for these sorts of one-off tasks!

### Defining a Function the New Way

To encourage the use of simple anonymous functions, the committee that manages JavaScript introduced a new notation for writing functions, called **"Fat Arrow Notation"**. Fat arrow functions remove the need to type `function` all the time and in certain special cases remove the need to type `return`. All told, fat arrow functions don't change how functions work, but they do make life easier for lazy programmers.

Here's the example above rewritten using fat arrow style:

~~~javascript
map(
	x => x * 8 +3,
	[1, 2, 3, 4]
);
~~~

That's a lot shorter! Here, the parameter list is just `x` followed by the fat arrow (`=>`) which I like to read as "will be transformed into" and the output of the function, which is `x * 8 + 3`. Every time you see a `=>` going forward, know that we are writing a function. They can be hard to get used to, so be vigilent!

There are some caveats to fat arrow functions. Consider our add function rewritten:

~~~javascript
const add = (num1, num2) => num1 + num2;
~~~

Here the parameter list is surrounded by parentheses. You have to surround parameters when your function has more than one argument (some style guides suggest it's a good idea to *always* surround your parameters with parentheses; they're not wrong, either, there are some odd conditions we'll see below).

If we were writing a function with more than one line in the body, we have to surround the body in brackets as in an old-style function and we have to use `return` to indicate the output.

Consider:

~~~javascript
const longAdd = (num1, num2) => {
	console.log(num1, num2);
	return num1, num2;
}
~~~

This doesn't save us anything over the old-style functions, but, as a rule, it's best to always either use old style or fat arrow functions in a project, to avoid confusion. So, if you like the simplicity of one-line fat arrow functions, you should also write your long functions in fat arrow style.

*Note*: there is one other programmatic difference between old style and fat arrow functions, but it's outside the scope of this course. However, I mention it here to do my due diligence as your instructor: an old style function has `this` bound to its scope while a fat arrow function inherits `this` from the scope in which it is defined. You don't need to know what this means to program in React, so don't get hung up on this. I just needed to tell you that so I can feel like you have been told.

## What can I do with functions?

As the existence of functional programming as a paradigm that rivals (some might say "exceeds") imperative and object-oriented programming might suggest, anything you can do with loops and lots of variables can be accomplished with functions. So, to answer the question in this section title: "anything".

However, there are some pretty neat things you can specifically do with functions. The two I want to talk about are higher-order functions and functional array transformations.

### Higher-Order Functions

Higher order functions are functions that return functions as output and/or take functions as arguments. We have already seen `map`, which takes a function and applies that function to each member of a list. `map` is a higher order function because it takes a function as its first argument.

#### Function as Parameters

Here's another example, a function that takes a function and an argument, and applies that function to the argument. I've written them in both old style and as fat arrow functions. Hopefully seeing them will show why fat arrow notation is so helpful for doing functional JavaScript.

~~~javascript
function subtract1(x) {
	return x - 1;
}
function applyTwice(f, x) {
	return f(f(x));
}
applyTwice(function (x) {
	return x + 1;
}, 1); // 3
applyTwice(subtract1, 3);
~~~

~~~ javascript
const subtract1 = x => x - 1;
const applyTwice = (f, x) => f(f(x));
applyTwice(x => x + 1, 1); 
applyTwice(subtract1, 3);
~~~

This example is sort of useless because it only works for 1-arrity functions, but it serves the purpose of showing how higher-order functions worse.

Also, as an aside, note the second call to `applyTwice`. Where the first example is supplied with an anonymous function, the second call is passed the name of a function called `subtract1`. If you have a named function, you can supply it to a higher-order function in this way: JavaScript treats functions as data.

#### Functions as output

A generator function is a common use-case for functions that return other functions. Imagine we want to say hello to our users, but we want to be able to do so in a variety of languages. We could write a generator function that would itself return a function to provide our greeting.

~~~javascript
function greetingGenerator(greeting) {
	return function(name) {
		return greeting + ', ' + name;
	}
}

// Usage examples:
const sayHello = greetingGenerator('Hello');
console.log(sayHello('Jane')) // Hello, Jane
const diHola = greetingGenerator('Hola');
console.log(diHola('Jane')) // Hola, Jane
const 问好 = greetingGenerator('你好');
console.log(问好('Jane')) // 你好, Jane
~~~

Let's look at how `sayHello` works. When we run `greetingGenerator('Hello')`, we create a scope in which `greeting` equals "Hello". From still within that scope, we create an anonymous function that takes `name` as a parameter and adds it to `greeting`, which is set in the scope in which the function exists. We then return that function. When we do, and this is very important, the function's scope stays with it, so `greeting` stays set as "Hello". We do the same for Spanish and Mandarin.

We can rewrite our greeting function using fat arrow notation:

~~~javascript
const greetingGenerator = greeting => name => greeting + ', ' + name;
~~~

Whoa! I'm tempted to make a "double fat arrow, what can it mean?" reference here, but I won't.

In any case, remember that fat arrow defines the mapping ("gets turned into") between a list of parameters and an output. If we want that output to itself be a function, the return value will be another list of parameters mapped to another output. If it helps to clarify what's happening, we can rewrite that example as:

~~~javascript
const greetingGenerator	= greeting => (name => greeting + ', ' + name);
~~~

So hopefully now you can see that `greeting =>` returns `(name => greeting + ', ' + name)`. If you're confused, don't worry. It took my months to believe that a double fat arrow worked the way it does. Also, this example is probably a good argument for why always wrapping parameters in parentheses for fat arrow functions is probably a good idea.

#### Putting It All Together: Dresser functions

You see a lot of functions in React that take a function and wrap it in additional functionality. These are accomplished with higher-order functions that both take and return functions. I call them "dressers" because they take a function and dress up it's behavior.

Let's say we wanted to take a 1-arrity function and dress it so that it returns its output but also outputs that value to the console. We could write a function like this:

~~~javascript
const dressWithConsoleLog = f => x => {
	const result = f(x);
	console.log(result);
	return result;
}
~~~

We could make a function that logs our `subtract1` function by calling:

~~~javascript
const subtract1WithLog = dressWithConsoleLog(subtract1);
subtract1WithLog(5);
~~~

With these double fat arrow functions, we can also call it like this:

~~~javascript
dressWithConsoleLog(subtract1)(5);
~~~

I'm going to get advanced for a second. If we wanted to write this using n-arrity functions, we have to be a bit tricky. Consider:

~~~javascript
const dressWithConsoleLog = f => (...args) => {
	const result = f.apply(null, args);
	console.log(result);
	return result;
}
~~~

We did some magic here. The `...` operator in the parameters of the second function is called a **"spread"**, which we'll talk more about in a bit. It says "take all the parameters passed to this function and condense them into one array, stored in a variable called 'arg'". Basically, it lets us gather an array of all the parameters passed to our function into a single array value. Then, we use a special method attached to all functions called [`apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply). Apply executes a function with an array as it's parameters (the first parameter sets `this` for the function call, but we don't need to know about that). So we are gathering all the parameters into an array and then using a neat trick supplied by JavaScript to pass that array to our function. It lets us do our dresser function for an n-arrity function, instead of just a 1-arrity.

### Functional Array Transformations

Now that we know big arrow functional notation, let's see some built-in, higher-order functions that can be used to transform arrays in JavaScript (which is something we're going to be doing a lot of).

In the advanced example above, we called `.apply` on a function. We called this a member function. Because JavaScript is object-oriented in addition to a functional language, data such as array or number or string are clones from prototype objects that define their behavior. These prototypes have member methods, which get attached to each clone of the particular prototype. So, for instance, all functions, which are clones of the `Function` prototype, have an `.apply` method attached to them.

For this section, we will be looking at three functions that are members of all clones of the `Array` prototype, which is a *very* common data-type in JavaScript applications. As with `Function.prototype.apply`, these methods will be called by typing a JSON representation of an array or the name of a variable storing an array followed by a period (or "dot" in programmer parlance) and followed by the method name. So if `Array.prototype` had a member method called `celebrate` (it doesn't sadly), to make an array celebrate, you could run `[1, 2, 3, 4].celebrate()` or `arrayVariable.celebrate()`, assuming `arrayVariable` actually contains an array (well, you can do it regardless of what's in the variable, but it will throw an error if `arrayVariable` contains a string).

*Note*: The above explanation of object-oriented programming, using prototypes and clones, is almost entirely unique to JavaScript, though it is present in several other, experimental languages. Most OOP languages use classes for inheritance, but because JavaScript just had to be different, it uses prototypes and clones.

#### `.map()`

We have already seen `map` as a stand alone function, but all arrays in JavaScript also have an implementation of map as a member function.

To reiterate how `map` works, consider how can we add one to each value in an array of numbers.

We could write a `for` loop, but those are so 2005:

~~~javascript
const addOne = array => {
	for(let i = 0; i < array.length; i++) {
		array[i]++;
	}
}
~~~

But this is 2019, we don't tell computers what to do anymore, we describe how to solve problems and let them figure it out:

~~~javascript
const addOne = array => array.map(item => item + 1);
~~~

Much better. Hopefully that's the last time I write a `for` loop in this class.

`Array.prototype.map()` applies a function to each member of an array and returns a new array composed of these function results.

#### `.reduce()`

Now that we have a handle on mapping, which, again, applies a function to each member of the array, how can we solve problems that ask us to convert an array into a single value, like, say, the highest number in an array or the sum of an array of numbers?

For this, we can use `Array.prototype.reduce`. Reduce takes two parameters: a 2-arrity function, called a reducer, and a starting value. The function's two parameters are called the accumulator and the current value. The second, current value, is filled in succession with each item in the array. The first, the accumulator, is first filled by the starting value and then subsequently filled with the result of the previous run of the function.

That's very confusing, so let's look at an example:

~~~javascript
const add = (num1, num2) => num1 + num2;
[1, 2, 3, 4].reduce(add, 0);
~~~

This call to reduce will produce the sum of an array, let's step through execution. Like `map`, `reduce` calls a supplied function on each element of an array, so we can replace the `reduce` with a series of function calls, like so:

~~~javascript
add(0, 1); // -> 1
add(1, 2); // -> 3
add(3, 3); // -> 6
add(6, 4); // -> 10
~~~

The function returns `10`, the final result of running the function. Note how in the first call to `add`, the first parameter is set to the second parameter to `reduce`, which is 0. The second call to `add`, the first parameter is `1`, which is the result of the first call to `add`. Each subsequent call is made with the result of the previous call. The final output of `reduce` is the output of the final call.

Consider another example:

~~~javascript
const highestNumber = array => array.reduce((highest, item) => item > highest ? item : highest, -Infinity);
~~~

This uses a ternary operation, which

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

