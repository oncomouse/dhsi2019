# React

## React Components

*Note*: There are two syntaxes for React, class-based and functional. React, as a whole, is tending toward functional syntax and with the introduction of Hooks in React 0.16, there's little reason to know the class syntax. However, many React tutorials and libraries still use the class syntax in examples. [Check out this tutorial on React's class syntax](react-class-syntax.md), if you want to know more about the original React syntax.

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

### React Best Practice

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

If we were to construct these props as a JavaScript array, we would have:

~~~json
{
	"type": "text",
	"name": "first-name",
	"class": "form__input",
	"placeholder": "Enter your first name"
}
~~~

And if our input was a React component, that is exactly what it's `props` parameter would look like.

#### Reserved Props

… Well not exactly.

In JavaScript, "class" is a reserved word, so React has you declare a CSS class for a component using `className`.

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

### Hooks

#### `useState`

#### `useEffect`

### Handlers

## Create React App
