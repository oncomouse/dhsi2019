# React

## React Components

*Note: There are two syntaxes for React, class-based and functional. React, as a whole, is tending toward functional syntax and with the introduction of Hooks in React 0.16, there's little reason to know the class syntax. However, many React tutorials and libraries still use the class syntax in examples. [Check out this tutorial on React's class syntax](react-class-syntax.md), if you want to know more about the original React syntax.*

React functional components are passed a JavaScript object containing what are called "Props" and return HTML that visualizes those props in some fashion. Along the way, React functional components use "Hooks" to add internal functionality and "Handlers" to respond to user input.

A component re-renders whenever props change or when certain effects trigger a re-render. In this way, components define dynamic, responsive HTML code that changes as data changes based on user interactions.

Here's a simple React component that renders a headline:


~~~javascript
const Headline = ({ title }) => (<h1>{title}</h1>);
~~~

Which rather clearly focuses our attention on what a React component does: extract the `title` key from a supplied object and return an `<h1>` tag containing that value as text.

How can we render HTML in our JavaScript?

The short answer is dark magic. The slightly longer answer is JSX, which is React's custom JavaScript XML notation. If you tried to load the above code in your browser, it wouldn't work. This is because, on the backend, a tool such as Create React App, is compiling our JavaScript + JSX code into vanilla JS that can be run by the browser. Create React App uses a transpiler called [Babel](https://babeljs.io) internally to do this translation. If you run our above example through Babel, the following JS code emerges:

~~~javascript
"use strict";

var Headline = function Headline(_ref) {
  var title = _ref.title;
  return React.createElement("h1", null, title);
};
~~~

So, you can begin to see what JSX is actually doing: it's window dressing that makes HTML tags into calls to `React.createElement`. You could write React without JSX, but it is significantly less convenient.

## Create React App

We need to get JSX transpiler set up and add support for some of the CSS stuff we'll be doing tomorrow, but in order to do that, thankfully, we can use a boilerplate application to get strated.

The React team has released a standardized boilerplate for building React apps called [Create React App](https://github.com/facebook/create-react-app), which provides a quick and easy way to instantiate React projects.

Assuming you have Node.js installed, you can run Create React App by executing `npx create-react-app <project-folder>` with `<project-folder>` being replaced by the name of whatever folder you want to store your new app in. **Don't run create-react-app right now**, though. The one downside to CRA is it relies on the central Node Package Management (NPM) repository to download all the packages you need to build a React app. On the very slow Wi-Fi we sometimes have at DHSI, it can take a while (one student last semester clocked a full run of CRA at 45 minutes). I asked you to download a precompiled CRA app, but I have also got a few copies of that .ZIP on USB sticks if anyone needs to get a copy.

So, in a future, post-DHSI world, you would have just finished running CRA, but we have just finished unzipping our CRA template.

In VS Code, go to File -> Open and browse to the folder created by CRA. Once it opens, go to `View->Terminal` to bring up the console. Type `npm run start` to start the development server for React. You may get asked if you want Node to control your browser, click OK or otherwise allow it. You will have a basic React app displayed in your browser.

Because you sometimes need the development server running *and* Node.js open to check code, if you go to `Terminal->Split Terminal` in Code, you can have two terminals open at the same time.

Let's look at your app.

## Writing React Components

### Props

Now that we've seen a basic component, how can we use it?

The big question you probably have in that direction is: what are props?

To answer that, let's think about an HTML element, such as a form `<input>`:

~~~html
<input type="text" name="first-name" class="form__input" placeholder="Enter your first name" />
~~~

This is an input element that has four props:

1. `type`
1. `name`
1. `class`
1. `placeholder`

If we were to construct these props as a JavaScript object, we would have:

~~~json
{
	"type": "text",
	"name": "first-name",
	"class": "form__input",
	"placeholder": "Enter your first name"
}
~~~

And if our `<input>` was a React component, that is exactly what it's `props` parameter would look like.

#### Reserved Props

… Well not exactly.

In JavaScript, "class" is a reserved word, so React has you declare a CSS class for a component using the `className` prop.

Additionally, "for" (which is used on `<label>`) is `htmlFor`.

You can read about the other reserved props [here](https://reactjs.org/docs/dom-elements.html).

#### Computed Props vs String Props

In our first example, we used `{text}` to display the value of the "text" prop. In JSX surrounding any text in curly braces indicates a JavaScript value. So, for instance, if wanted to display the value of 2+2 in a paragraph, the JSX would be `<p>{2 + 2}</p>`. This syntax is used for function calls as well as variables.

It can also work for props. Consider the following code, which extends our original example a bit:

~~~javascript
const Controller = (props) => {
	const {
		title
	} = props;
	return (
		<Title title={title} className="title" />
	);
}

const Title = (props) => {
	const {
		title,
		className
	} = props;
	return (
		<h1 className={className}>{title}</h1>
	);
}
~~~

Here we have two components, `Controller` and `Title`. Controller receives `title` as a prop and passes it to `Title`. It also sets the `className` for Title. Note how one is a string and the other is a computed prop.

We have also demonstrated a key feature here: prop passing. One way to synchronize across a variety of components is by passing props from a centralized component (sometimes called a container) to sub components that merely display the results of the computation that happens in the container. We'll see more of this when we get to handlers.

## INTERLUDE: React Best Practice

I'm going to rewrite our example component again:

~~~javascript
const Headline = (props) => {
	const {
		title
	} = props;
	return (
		<h1>{title}</h1>
	);
}
~~~

I'm **destructuring** the `props` object into local variables containing the props I will be specifically working with in my component. This makes my code easier to read.

While it isn't required, it is considered a best practice in React to destructure your props.

### Handlers

JavaScript works by attaching "event listeners" to elements in the HTML document. These listeners are functions that run every time a particular event is triggered.

Here is an example that uses JavaScript's Document Object Model (DOM) API:

~~~javascript
document.querySelectorAll('li a').addEventListener('click', function(ev) {
	ev.preventDefault();
	console.log('You clicked on ' + ev.target);
});
~~~

This is not an interesting example, but it will attach a function to every link (`<a>` tag) inside of a list item (`<li>`). This function will cancel the usual link behavior and instead just log the `<a>` to the console.

In this example, the function that takes an event object (`ev`) is called an event handler. It handles the `click` event for those links.

In React, we pass event handlers to special event props (that are all of the form "on" + (capitalized event name), so "onClick" or "onChange"). React uses [most DOM events](https://reactjs.org/docs/events.html#supported-events) in JSX.


To implement the same behavior in React, we do:

~~~javascript
import React from 'react';

const SimpleHandler = () => {
    const clickHandler = (ev) => {
        ev.preventDefault();
        console.log(`You clicked on ${ev.target}`);
    };

    const names = [
        'Mary',
        'Amy',
        'Rita',
        'Samantha'
    ];

    return (
        <div>
            <ul>
                {names.map((name, i) => (
                    <li key={i}>
                        <a
                            onClick={clickHandler}
                            href={`https://en.wikipedia.org/wiki/${name}`}
                        >{name}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default SimpleHandler;
~~~

### Hooks

#### `useState`

In React, a component has two ways of tracking data: props, which we have talked about, and state. Where props are passed to the component from a parent component, state is used to keep track of data internally. There is very little in React we cannot keep track of without some kind of internal state.

To add state to a functional React component, we use the `useState` hook. `useState` takes one argument, the initial value of the state variable being created and returns an array of two items: the state variable and a function to call whenever the state variable needs to be updated.

Let's look at an example:

~~~javascript
import React, { useState } from 'react';

const Counter = () => {
	const [count, setCount] = useState(0);

	const increment = () => setCount(count => count + 1);
	const decrement = () => setCount(count => count - 1);
	const reset = () => setCount(0);

	return (
		<div>
			<button onClick={decrement}>-</button>
			<span>{count}</span>
			<button onClick={increment}>+</button>
			<br />
			<button onClick={reset}>Reset</button>
		</div>
	);
};
~~~

A couple of questions:

1. What is happening in `increment` and `decrement`?
	* The setter function can be passed a function when you need to rely on the previous value of state.
1. Why can't we just do `increment = () => setCount(count + 1)`?
	* If you don't pass a function to setter, and you call `setCount` twice, you won't have the most recent value.
	* React functional components only update once per batch of updates.

In React class components, `state` was a single object and you could update the state object by calling `setState` on the part of the object you needed to update. Functional components are designed to not make this easy, so you have to return the entire object, if you're using an object in `state`. Here's an example:

~~~javascript
import React, { useState } from 'react';

const Counter = () => {
	const [state, setState] = useState({
		count: 0,
		otherThing: 'hello'
	});

	const increment = () => setState(state => ({
		...state,
		count: state.count + 1
	});
	const decrement = () => setState(state => ({
		...state,
		count: state.count - 1
	});
	const decrement = () => setState(state => ({
		...state,
		count: 0
	});

	return (
		<div>
			<button onClick={decrement}>-</button>
			<span>{state.count}</span>
			<button onClick={increment}>+</button>
			<br />
			<button onClick={reset}>Reset</button>
		</div>
	);
};
~~~

We have to use destructuring to rebuild the entire state object and then we can update the key(s) we care about.

#### `useEffect`

Another thing React components do is respond to state and prop changes but not in ways that directly result in HTML changes. These side effects generally consist of changing other document elements or in signalling external APIs. To do this, you use the `useEffect` hook, which lets you create a function that runs whenever data changes.

~~~javascript
import React, { useState, useEffect } from 'react';

const Counter = () => {
	const [count, setCount] = useState(0);

	useEffect(() => {
	console.log(`Count is currently: ${count}`);
	}, [count]);

	const increment = () => setCount(count => count + 1);
	const decrement = () => setCount(count => count - 1);
	const reset = () => setCount(0);

	return (
	<div>
		<button onClick={decrement}>-</button>
		<span>{count}</span>
		<button onClick={increment}>+</button>
		<br />
		<button onClick={reset}>Reset</button>
	</div>
	);
};
~~~

1. What is the second argument passed to `useEffect` doing?

Sometimes, you only want an effect to happening when a component is mounting (being created) or unmounting (being destroyed). To do this, we can still use `useEffect`:

~~~javascript
import React, { useState, useEffect } from 'react';

const Counter = () => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		console.log(`Count is currently: ${count}`);
	}, [count]);

	// Mount & Unmount Side Effects:
	useEffect(() => {
		console.log('I\'m mounting…');
		return () => {
			console.log('I\'m unmounting…');
		};
	}, []);

	const increment = () => setCount(count => count + 1);
	const decrement = () => setCount(count => count - 1);
	const reset = () => setCount(0);

	return (
		<div>
			<button onClick={decrement}>-</button>
			<span>{count}</span>
			<button onClick={increment}>+</button>
			<br />
			<button onClick={reset}>Reset</button>
		</div>
	);
};
~~~

1. Why does the new effect only run at mount?
	* Note the second argument; by setting it to an empty array, there are no values that could ever update.
1. What's going on with the unmount function?
	* If an effect returns a function, that function will run when the component is being unmounted.

#### Other Hooks

There are a [few other built-in hooks](https://reactjs.org/docs/hooks-reference.html). There are also a number of hooks available as libraries for extending React.

## Using Hooks and Handlers: Basic React Forms

Now that we know how to do hooks and handlers, we can talk about React's approach to forms (which is a bit idiosyncratic). These simple forms will work for most basic situations. The day after tomorrow, we'll talk about how to use some libraries that make this easier for complex forms.

In React, a form component's value should display a state variable and should be updated using an `onChange` handler.So, for instance, to let a user input name, we'd do:

~~~javascript
import React, { useState } from 'react';

const Form = () => {
	const [userInput,  setUserInput] = useState('');

	const handleChange = ev => setUserInput(ev.target.value);
	const handleSubmit = (ev) => {
		ev.preventDefault();
		// Do whatever you'd do with userInput, like send it to a parent or call an API
		setUserInput('');
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="user">Enter User Name:</label>
				<input name="user" onChange={handleChange} value={userInput} />
			</div>
			<div>
				<button type="submit">Add User</button>
			</div>
		</form>
	);
}
~~~

We do forms this way to avoid having to interact with the DOM API to get the value of each form input. The issue with this approach, however, is it gets very complicated if you have an even remotely complex form. As I said, in two days, we will look at a library called [Formik](https://jaredpalmer.com/formik/) that simplifies a lot of this work.

## Shortcutting React Components in VS Code

One of the best features of VS Code is the ability to write snippets, custom shortcut completions that quickly define large blocks of code.

In VS Code, hit the command <kbd>Ctrl+Shift+P</kbd> (Windows) or <kbd>Command+Shift+P</kbd> (Mac) to open the command window. Type "snippet" and select "Preferences: Configure User Snippets". Press <kbd>Enter</kbd>. In the menu that appears, find "javascript" and press <kbd>Enter</kbd>.

Doing so will open a `javascript.json` file. Copy the code below, paste it in place of the contents of that file, and save it.

When you open a `.js` file in VS Code, type "react" and press <kbd>Tab</kbd>. You can then type the name of our component. Press <kbd>Tab</kbd> once more and you can define props in the destructuring command.

~~~javascript
{
	// Place your snippets for javascript here. Each snippet is defined under a snippet name and has a prefix, body and 
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the 
	// same ids are connected.
	// Example:
	// "Print to console": {
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
	// }
	"Define a React file": {
		"prefix": "react",
		"body": [
			"import React from 'react';",
			"",
			"const $1 = (props) => {",
			"\tconst {",
			"\t\t$2",
			"\t} = props;",
			"",
			"\treturn (",
			"\t\t<div />",
			"\t);",
			"}",
			"",
			"export default $1;"
		],
		"description": "Create a new React component."
	}
}
~~~

## Exercises!

### `longestWord`: The React Component

Write a React component that uses the `longestWord` function we wrote in Exercise 2 from yesterday. For the component, I'd like you to have a form that let's a user input a sentence and, as they type, displays the longest word in an `h1` tag.

#### Questions

1. Can we use the `longestWord` solution we wrote yesterday without having to copy / paste it?
1. How can we visually check the results of our work?

### Add to a List of Users

Write a React component that extends the form example above by adding the user name input by the user to an Array. The component should also display the user names that have been added.

#### Questions

1. How do we track the list of users?
1. How do we display an array in React?
