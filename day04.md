# Day 04 — Advanced React

## How Do We Exchange Data Between Components?

### Passing Down Props

The easiest way to solve this is by passing props. For instance:

~~~javascript
import React, { useState, useEffect } from 'react';

const Button = (props) => {
  const {
    clickHandler,
    children,
    ...otherProps
  } = props;

  return (
    <button onClick={clickHandler} {...otherProps}>{children}</button>
  );
};

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`Count is currently: ${count}`);
  }, [count]);

  const decrement = () => setCount(count => count - 1);
  const increment = () => setCount(count => count + 1);
  const reset = () => setCount(0);
  return (
    <div>
      <Button clickHandler={decrement}>-</Button>
      <span>{count}</span>
      <Button clickHandler={increment}>+</Button>
      <br />
      <Button clickHandler={reset}>reset</Button>
    </div>
  )
}

export default Counter;
~~~

Can we imagine situations where this might become a problem?

What happens if we need to have sub-components from `<Button>`? Or what happens if we change our application architecture?

Thinking about DRY and the logic of React, prop-passing and `useState()` also place a lot of application logic in components, something generally avoided in React.

*Discuss designating `components` vs `containers` in React projects*

### Unstated to the Rescue

We are going to look here at two ways of handling this problem, both of which let you abstract the state logic from the display logic.

Up first is [Unstated](https://github.com/jamiebuilds/unstated).

`npm install unstated` to install.

~~~javascript
import React from 'react';
import { render } from 'react-dom';
import { Subscribe, Container, Provider } from 'unstated';

class CounterContainer extends Container {
  state = {
    count: 0
  };
  increment = () => this.setState(state => ({ count: state.count + 1 }));
  decrement = () => this.setState(state => ({ count: state.count - 1 }));
  reset = () => this.setState({ count: 0});
}

const Counter = () => {
  return (
    <Subscribe to={[CounterContainer]}>{ counter => (
      <div>
        <button onClick={counter.decrement}>-</button>
        <span>{counter.state.count}</span>
        <button onClick={counter.increment}>+</button>
        <br />
        <button onClick={counter.reset}>reset</button>
      </div>
    )}</Subscribe>

  );
}

render(
  <Provider>
    <div className="App">
      <Counter />
    </div>
  </Provider>,
  document.getElementById('root')
);
~~~

### `useReducer`

React has another hook, called `useReducer`, that can address this problem.

This derives from the [redux](https://redux.js.org/) infrastructure, which is a logical way of organizing data interactions in very large projects (Facebook developed the original software architecture to manage data collision problems in its social media platform).

A **reducer** is a special type of function that takes two arguments:

1. `state` (the overall state of the application)
	* This can be as simple as our counter value or as complex as big data structure.
1. `action` (the action to take)
	* By convention an action is a JavaScript object with two keys:
		1. `type` -- the type of action being performed
		1. `payload` -- any data that may be necessary to perform the action.

The function has a very particular return type: if the action is of a type the reducer cares about, it returns *a copy* of `state` having been updated based on the action. If the action is of a type the reducer does not care about, it returns `state` unchanged.

Here's how we do this with React's new `useReducer` hook:

`Counter.js`

~~~javascript
import React, { useReducer } from 'react';
import reducer, { initialState, incrementAction, decrementAction, resetAction } from '../reducers/counter';

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <button onClick={() => dispatch(decrementAction())}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch(incrementAction())}>+</button>
      <br />
      <button onClick={() => dispatch(resetAction())}>reset</button>
    </div>
  );
}

export default Counter;
~~~

We have an additional file called a ["duck"](https://github.com/erikras/ducks-modular-redux) (for … reasons) that contains the code needed to set up our reducer:

`./reducers/counter.js`

~~~javascript
// Symbols
const INCREMENT = Symbol('INCREMENT');
const DECREMENT = Symbol('DECREMENT');
const RESET = Symbol('RESET');

// Actions
export const incrementAction = () => ({
  type: INCREMENT
});

export const decrementAction = () => ({
  type: DECREMENT
});

export const resetAction = () => ({
  type: RESET
});

// Reducer
export const initialState = {
  count: 0
};

const actions = {
  [INCREMENT]: (state) => ({ count: state.count + 1 }),
  [DECREMENT]: (state) => ({ count: state.count - 1 }),
  [RESET]: () => ({ count: 0})
};

export default (state, action) => {
  if (Object.prototype.hasOwnProperty.call(actions, action.type)) {
      return actions[action.type](state, action);
  }
  return state;
}
~~~

#### Reducers and State Copies

It is important that a reducer must return a copy of state, not merely an update of the state variable passed. This only matters for arrays and objects which are passed by reference in JavaScript. Passed by reference means that when you pass an array as an argument to a function, any modifications made to the array inside the function are also made outside the function. As such, a reducer that changes a complex state has to return a new array or object. Here's an example:

Suppose we are managing a list of users with a reducer. We might define a duck that looks like this:

~~~javascript
const ADD_USER = Symbol('ADD_USER');
const REMOVE_USER = Symbol('REMOVE_USER');

export const addUserAction = name => ({
  type: ADD_USER,
  payload: {
    name
  }
});

export const removeUserAction = name => ({
  type: REMOVE_USER,
  payload: {
    name
  }
});

export const initialState = [];

const actions = {
  [REMOVE_USER]: (state, action) => {
    const index = state.indexOf(action.payload.name);
    return index < 0 ? state : [
      ...state.slice(0, index),
      ...state.slice(index + 1)
    ]
  },
  [ADD_USER]: (state, action) => [
    ...state,
    action.payload.name
  ]
}

export default (state, action) => {
  if (Object.prototype.hasOwnProperty.call(actions, action.type)) {
    return actions[action.type](state, action);
  }
  return state;
}
~~~

Note that we are using array slices and array spreads to generate a new array for both adding and removing users. We do this because it generates a copy of the array. If we just did `state.push(action.payload.name); return state` in the `ADD_USER` reducer, we would have an invalid reducer, because it returns a copy of state instead of a new object.

## How Do We Handle Forms?

### The React Way

Two days ago, we talked about the basic combination of hooks and handlers needed to implement forms in React. I mentioned that the React approach, while logical, gets very complicated, very quickly. Here is a longer form that tries to manage a bigger form as best it can:

~~~javascript
import React, { useState } from 'react';

const has = (key, object) => Object.prototype.hasOwnProperty.bind(object, key);

const BigForm = () => {
  const [users, setUsers] = useState([]);

  const initialState = {
      firstName: '',
      lastName: '',
      age: 0
  };

  const [formState, setFormState] = useState(initialState);

  const [errors, setErrors] = useState({});

  const updateFormValue = key => ev => {
      // We have to cache the value bc React events vanish:
      const value = ev.target.value;
      setFormState(prevFormState => ({
        ...prevFormState,
        [key]: value
      }))
  };

  // Do nothing validation:
  const validate = values => ({});

  const handleFormSubmit = ev => {
    ev.preventDefault();
    const errors = validate(formState);
    if (Object.keys(errors).length === 0) {
      // Update users:
      setUsers(prevUsers => ([
        ...prevUsers,
        formState
      ]));
      // Reset Form
      setFormState({
        ...initialState
      });
    } else {
      // Attach error state
      setErrors(errors);
    }
  }

  return (
    <div>
      <h1>Complicated User Form</h1>
      {users.length === 0 ? (<p><em>No Users</em></p>) : (
        <ul>
          { users.map((user, i) => (
            <li key={i}>{user.firstName} {user.lastName} ({user.age})</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input type="text" value={formState.firstName} onChange={updateFormValue('firstName')} />
          { has('firstName', errors) ? (<div className="error">{errors.firstName}</div>) : null }
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" value={formState.lastName} onChange={updateFormValue('lastName')} />
          {has('lastName', errors) ? (<div className="error">{errors.lastName}</div>) : null}
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input type="number" value={formState.age} onChange={updateFormValue('age')} />
          {has('age', errors) ? (<div className="error">{errors.age}</div>) : null}
        </div>
        <div>
          <button type="submit">Add User</button>
        </div>
      </form>
    </div>
  )
}

export default BigForm;
~~~

This is still pretty complicated, though we could make it work if we needed to.

However, thankfully, this is a common problem in the React community, so we can probably find a library to do much of this for us.

### Formik!

[Formik](https://jaredpalmer.com/formik/) is a form abstraction layer for React. It doesn't do anything fancy (there are some very fancy React form libraries) but it lets us write DRY forms.

`npm install formik` to install.

Here's the above example rewritten for Formik:

~~~javascript
import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './BigForm.css';

const BigForm = () => {
  const [users, setUsers] = useState([]);

  const initialState = {
    firstName: '',
    lastName: '',
    age: 0
  };

  const validate = values => ({});

  return (
    <div>
      <h1>Complicated User Form</h1>
      {users.length === 0 ? (<p><em>No Users</em></p>) : (
        <ul>
          { users.map((user, i) => (
            <li key={i}>{user.firstName} {user.lastName} ({user.age})</li>
          ))}
        </ul>
      )}
      <Formik
        initialValues={initialState}
        validate={validate}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setUsers(prevUsers => {
            setSubmitting(false);
            resetForm();
            return [
              ...prevUsers,
              values
            ];
          }); 
        }}>
        {({ isSubmitting, errors, touched }) => (
          <Form className="form">
            <div className={'form__set' + (errors.firstName && touched.firstName ? ' form__set--error' : '')}>
              <label className="form__label" htmlFor="firstName">First Name</label>
              <Field type="text" name="firstName" className="form__input" />
              <ErrorMessage className="form__error-message" name="firstName" component="div" />
            </div>
            <div className={'form__set' + (errors.lastName && touched.lastName ? ' form__set--error' : '')}>
              <label className="form__label" htmlFor="lastName">Last Name</label>
              <Field type="text" name="lastName" className="form__input" />
              <ErrorMessage className="form__error-message" name="lastName" component="div" />
            </div>
            <div className={'form__set' + (errors.age && touched.age ? ' form__set--error' : '')}>
              <label className="form__label" htmlFor="age">Age</label>
              <Field type="number" name="age" className="form__input" />
              <ErrorMessage className="form__error-message" name="age" component="div" />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0}>Add User</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
    
export default BigForm;
~~~

### Validate with Yup

[Yup](https://github.com/jquense/yup) does "dead simple object schema validation." It's a very easy way to validate a form. Here's how we might rewrite our validate method from above to do validation:

`npm install yup` to install.

~~~
import * as yup from 'yup';

const schema = yup.object().shape({
firstName: yup
  .string()
  .required(),
lastName: yup
  .string()
  .required(),
age: yup
  .number()
  .positive()
  .integer()
  .required()
});
~~~

Yup integrates with Formik, so you can change the prop `validate={validate}` to `validationSchema={schema}` and Formik will validate your form *and* generate error messages!

## How Do I Access External Data?

### `fetch`

`fetch` is the newest JavaScript API for getting external data. `fetch` can be a bit finicky, but it's better than the older XMLHttpRequest API. [Google has a good tutorial about it](https://developers.google.com/web/updates/2015/03/introduction-to-fetch).

Fetch uses the JavaScript `Promise` API, which is a way of describing what an asynchronous actions *will* do (rather than what it does). Rather than work with a returned value, Promises have you chain one or more calls to `.then()` where each function passed as an argument to `then()` will be the returned value of the previous `then()` or the result of `fetch()` itself. These calls will only execute *when the API call is done*. This takes some getting used to, but here's an example:

~~~javascript
fetch('some.remote.json')
  .then((response) => {
    console.log(response.headers.get('Content-Type'));
    console.log(response.headers.get('Date'));

    console.log(response.status);
    console.log(response.statusText);
    console.log(response.type);
    console.log(response.url);
  });
~~~

All of those console messages, which tell us about the information the server responded with, will only show up when the request is complete.

A more complete `fetch` call would look like this (and you can use this as boilerplate in your apps):

~~~javascript
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

fetch('https://jsonplaceholder.typicode.com/todos')
  .then(status)
  .then(response => response.json()) // Access the JSON data (as a JS object)
  .then(data => {
    console.log('Here's your data: ' + data);
  })
  .catch(error => {
    console.log('There was an error: ' + error);
  });
~~~

You can also use `fetch` for "POST", "PUT", and "DELETE" operations, if you are working with a full REST API:

~~~javascript
fetch(url, {
  method: 'post',
  headers: {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
  },
  body: 'foo=bar&lorem=ipsum'
})
  .then(status)
  .then(response => response.json())
  .then(data => {
    console.log('Here's your data: ' + data);
  })
  .catch(error => {
    console.log('There was an error: ' + error);
  });
~~~

There are also libraries that can convert form and state data in React into a valid `fetch` call.

#### The Dreaded CORS Error

If you are working with an API on a different domain from your application, you may encounter an error that mentions that your request "has been blocked from loading by Cross-Origin Resource Sharing policy: No 'Access-Control-Allow-Origin' header is present on the requested resource." This error is because [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests (which are ones that move between two domains) are disabled by default in modern browsers for security reasons.

If you control the API server, there are ways to turn enable CORS for a particular domain ([for instance, here's how to do it in Express](https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b)).

Another way to do it is using something called JSONP, which embeds the data in a `<script>` tag and loads it using a JavaScript callback function (this is considered more secure by browser makers).

For instance, if you called an API that took `key` and `value` as GET parameters and returned a JSON object, you could `fetch` a URL at `http://my.api/object.json?key=foo&value=bar` and get the following JSON back:

~~~json
{
	"foo": "bar"
}
~~~

Now, with JSONP, we would have to `fetch` something like `http://my.api/object.jsonp?key=foo&value=bar&callback=processObject` and we would get the following back:

~~~javascript
processObject({
  "foo": "bar"
})
~~~

We have to pass an additional parameter, the callback method, to our API and it returns a JavaScript function call to that callback, passing the data we want as a parameter.

Because of this additional parameter and particular output format, not all APIs support JSONP, but for those that do, you can use a library called [fetch-jsonp](https://github.com/camsong/fetch-jsonp) that emulates the `fetch` API for JSONP. For most scenarios, it works out of the box ("callback" is the default name for the callback parameter in JSONP).

So, we could use `fetch-jsonp` to search Wikipedia's API, for instance:

~~~javascript
import fetch from 'fetch-jsonp';

fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=50&format=json`)
  .then(response => response.json())
~~~

This will work out of the box with `fetch-jsonp`, as Wikipedia's API supports JSONP and uses callback as the parameter.

However, consider this API that supports JSONP and returns random quotes:

~~~javascript
import fetch from 'fetch-jsonp';

fetch('http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp', {
  jsonpCallback: 'jsonp' // Name of API GET parameter where callback name is sent
})
  .then(response => response.json())
~~~

This API uses `jsonp` as the name of the callback parameter, so we have to supply it to fetch-jsonp. Most APIs are open about this sort of information, so if you encounter a CORS error when interacting with an API, check to see if it supports JSONP.

### `useThunkReducer`

In the realm of funny-sounding computer science terms, a "thunk" is pretty high on the list. We've been using several of them already, but a thunk is a function that returns another function.

In Redux (and by extension when we use the `useReducer` effect), thunks are the easiest way to implement accessing external data. We simply write a reducer that returns a function which takes two arguments: `dispatch` and `getState`. Both are functions.

We can then write our actions like so:

~~~javascript
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

function incrementAsync() {
  return dispatch => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}
~~~

If we replaced the `setTimeout` call with a `fetch` call, we can then `dispatch` a synchronous action when our API call is finished to move the reducer forward.

Here's `useThunkReducer`:

~~~javascript
import { useReducer } from 'react';

const wrapper = ([state, dispatch]) => {
  return [state, (action) => {
    if(typeof action === 'function') {
      return action(dispatch, () => state);
    } else {
      return dispatch(action);
    }
  }];
}

const useThunkReducer = (reducer, initialState, init=x=>x) => {
  return wrapper(useReducer(reducer, initialState, init));
}

export default useThunkReducer;
~~~

## How Do I Build an App with Multiple Pages?

### React-router

React Router let's you build a single page React app that uses multiple pages that users can move through like a standard HTML website.

React Router is ridiculously powerful and I find I have to look up the API every time I use it, anyway, so I have an example below, but I would suggest looking at [the documentation](https://reacttraining.com/react-router/web/guides/quick-start) to get a sense of everything React Router can do.

~~~javascript
import React from 'react';
import { BrowserRouter as Router, NavLink, Route, Switch } from 'react-router-dom';
import styled from '@emotion/styled';

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  display: inline-block;
  margin: 0.25rem 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  color: blue;
  text-decoration: none;
  &.active {
    font-weight: bold;
  }
  &:hover {
    text-decoration: underline;
  }
`

const NavBar = () => (
  <nav>
    <NavLinks>
      <NavItem>
        <StyledNavLink to="/page1">Page 1</StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/page2">Page 2</StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/page3">Page 3</StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/page4">Page 4</StyledNavLink>
      </NavItem>
    </NavLinks>
  </nav>
)

const App = () => {
  return (
    <Router>
      <NavBar />
      {/* Use <Switch> to only render matching route: */}
      <Switch> 
        <Route path="/page1" component={Page1} />
        <Route path="/page2" component={Page2} />
        <Route path="/page3" component={Page3} />
        <Route path="/page4" component={Page4} />
        <Route component={Default} />
      </Switch>
    </Router>
  );
}

const PageFactory = (number) => () => (<div><h1>Page {number}</h1><p>Welcome to Page {number}</p></div>);
const Page1 = PageFactory(1);
const Page2 = PageFactory(2);
const Page3 = PageFactory(3);
const Page4 = PageFactory(4);

const Default = ({ location }) => (<div><h1>Default Page</h1><p>Looks like you tried to browse to {location.pathname}, but I don't know that page.</p></div>);

export default App;
~~~

You can also detect routes using pattern matching:

~~~javascript
import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Route path="/page:number(\d+)" component={Page} />
      <Route component={Default} />
    </Router>
  );
}

const Page = ({ match }) => (<div><h1>Page {match.params.number}</h1><p>Welcome to Page {match.params.number}</p></div>);

const Default = ({ location }) => (<div><h1>Default Page</h1><p>Looks like you tried to browse to {location.pathname}, but I don't know that page.</p></div>);

export default App;
~~~

React Router uses a library called [path-to-regexp](https://github.com/pillarjs/path-to-regexp) for generating these matches. There are a lot of options, so take a look at the documentation, if you need to write more complex route matches.

#### Code Splitting React Router

Apps with multiple pages can start to get very big. Thankfully React Router supports what is called "code splitting" (this is actually something supported generally by Create React App and you can use it in multiple ways). With code splitting, you can only load the route you need, as the user browses to it. If they don't visit every page, they won't use all of them.

* [Official React Router Guide to Code-splitting](https://reacttraining.com/react-router/web/guides/code-splitting)
* [You can also use the new `Suspense`/`lazy` API in React](https://itnext.io/async-react-using-react-router-suspense-a86ade1176dc)

## Other React Things to Know

1. Server-side Rendering: you can use React in Node.js server application to render static HTML that can be "re-hydrated" after the initial render. This makes your React applications indexable by search engines and speeds the initial page load.
	* [API overview for `react-dom-server`](https://reactjs.org/docs/react-dom-server.html)
	* [Overview of how to do this w/ Express](https://flaviocopes.com/react-server-side-rendering/)
1. SSR Frameworks: these are all-in-one application frameworks, like much more powerful versions of CRA. They support things like routing and static compilation right out of the box.
	* [Next.js](https://nextjs.org/)
	* [Gatsby](https://www.gatsbyjs.org/)
1. Data Visualization
	* [Good article on data viz components for React](https://medium.com/dailyjs/data-visualization-libraries-for-react-developers-in-2019-a2b9c01262f8)
1. [React Native](https://facebook.github.io/react-native/)
	* Build mobile apps using React & JavaScript
1. Awesome Lists
	1. [React Components](https://github.com/brillout/awesome-react-components)
	1. [React](https://github.com/enaqx/awesome-react)
1. [GraphQL](https://graphql.org/)
	* A complex, structured query language used in a lot of React apps.
	* [Apollo](https://www.apollographql.com/) is a popular client/server framework for GraphQL apps.
1. Testing in React
	* [Good Overivew of the Technologies and Techniques](https://medium.com/dailyjs/testing-react-an-overview-56204839cbad)

## General JavaScript Things

With Node.js, you can now write server-side code in JavaScript. Combined with React (and linked using a REST API or GraphQL), your entire application can be written in the same language. You can use code on both the server and in the browser.

To get started with this, read up on [Express](https://expressjs.com/), the very minimal but very powerful Node.js server framework.

Combining front-end and back-end code in the same language like this is where you see React really shine. By loading all your rendering code in the browser, the back-end is very small and fast and, by using standard data-interchange formats, your server can exchange data with other applications using the same interface it streams data to your front-end.

## Exercises!

A standard way to learn a new JavaScript framework, such as React, is to implement [TodoMVC](http://todomvc.com/examples/backbone/). TodoMVC is a standard Todo list that supports adding todo items to a list, toggling between **completed** and **active**, editing, filtering, etc. It teaches the basics of dynamic, data-driven websites while offering a standardized CSS base to work from.

Especially given that the example TodoMVC for React uses an ancient version of the library, I thought it might be fun to implement TodoMVC as practice for what we've learned this week. We can work on it today and tomorrow morning before the showcase.

Here are the features of TodoMVC, sorted by HTML container:

* `<header>`:
	* An `<h1>` that says "todos"
	* Add a new todo item using an `<input>`
		* Pressing <kbd>enter</kbd> will add the todo list
		* Do not add a blank todo item
		* Input will have a placeholder of "What needs to be done?"
* `<section>` (className="main"):
	* Toggle all displayed todos to either completed or active using a checkbox `<input>`
		* If all items are completed, the checkbox will be checked.
		* Otherwise, the checkbox will be unchecked.
		* Unchecking a checked box will convert all items to active
		* Checking an unchecked box will convert all items to completed.
	* An unordered list (`<ul>`) displaying each todo item
		* Todo items will be displayed as `<li>` tags and will contain:
			* A `<div>` (className="view") that contains:
				* A checkbox input that is checked when the item is completed and unchecked when active
				* A `<label>` containing the title of the todo item
				* A `<button>` that deletes the todo item when clicked.
* `<footer>`:
	* A counter displaying how many active items remain in the form "X items left"
	* A `<ul>` containing three filter `<button>`s that, when clicked:
		* Display all items
		* Display active items
		* Display completed items
		* The button for the active filter will have a different class attached to indicate it is active
	* A `<button>` that, when clicked, will delete all completed tasks.

I've tried to chunk TodoMVC into components, but we may need others. Even given this, you will still want to look at the HTML in developer tools, to see how TodoMVC attaches classes and generates the functionality it uses.

Also, in terms of getting started, here are some additional questions:

* What state data are we going to need to keep track of?
	* What operations will we need to perform on the data?
	* How will the data we need to track be structured?
* How should we organize our project?
* How should we organize our components?
	* Do we need unstated?
	* `useReducer`?

Let's start by making a list of components and state data we will need.

### Optional Feats

As if TodoMVC isn't enough, here are some other tasks we could try to implement.

#### Persistent State

You'll notice in the example TodoMVC linked above that reloading the page persists the todo list, as you make changes to it. How do we do this in React?

Two hints:

* You'll want to read up on "persistent state" in React.
* You'll also want to see how to do this with hooks, which are relatively new in React.

#### REST API

The very cool resource [JSONPlaceholder](https://jsonplaceholder.typicode.com) offers a free, dummy REST API for testing applications. One data endpoint in the API is for todo list items. How could we add a REST component to our TodoMVC app?

[Here's an overview of using JSONPlaceholder as a REST API](https://github.com/typicode/jsonplaceholder#how-to), to get you started.

JSONPlaceholder uses userIDs to sort the Todos. Here's an example of the output: [https://jsonplaceholder.typicode.com/todos?userId=1](https://jsonplaceholder.typicode.com/todos?userId=1)

#### Custom Styles

TodoMVC could probably use a fresh, 2019 style (maybe [vaporwave](https://www.google.com/search?q=vaporwave&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjpm46Ox6DiAhUMd6wKHTfeCJ0Q_AUIDigB&biw=1462&bih=822)?). How would we go about updating the style?

What technology should we use to do this? Emotion? SCSS? Modules or global files?

#### Adding User Logins

I think the three above feats are probably enough, but if we wanted to get even more into building out our TodoMVC app, we could add actual user authentication. I recently registered for [Okta](https://okta.com), a headless user management service. It's free for the first 1000 users and then goes up from there.

If we wanted to get really fancy with our app, we could use Okta to authenticate our users and then download JSONPlaceholder data based on their user IDs.

Here's the tutorial for [React and Okta](https://developer.okta.com/code/react/), though I've not actually done this part before, so we would all be learning something.

To use this, I believe we would need React router to break our app into three routes:

* Login page
* User Registration
* Todo App

We would also need to read up on how to protect routes in react router, so that we aren't showing user-only content to just anyone.
