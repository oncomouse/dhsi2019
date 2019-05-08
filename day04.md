# Advanced React

## How Do We Exchange Data Between Components?

### Passing Down Props

The easiest way to solve this is by passing props. For instance:

~~~javascript
import React from 'react';
import { render } from 'react-dom';

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

render(
	<div className="App">
		<Counter />
	</div>,
	document.getElementById('root')
);
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

### Formik!

[Formik](https://jaredpalmer.com/formik/) is a form abstraction layer for React. It doesn't do anything fancy (there are some very fancy React form libraries) but it lets us write DRY forms.

`npm install formik` to install.

Here's the above example rewritten for Formik:

~~~javascript
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

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
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="firstName">First Name</label>
                            <Field type="text" name="firstName" />
                            <ErrorMessage name="firstName" component="div" />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name</label>
                            <Field type="text" name="lastName" />
                            <ErrorMessage name="lastName" component="div" />
                        </div>
                        <div>
                            <label htmlFor="age">Age</label>
                            <Field type="number" name="age" />
                            <ErrorMessage name="age" component="div" />
                        </div>
                        <div>
                            <button type="submit" disabled={isSubmitting}>Add User</button>
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

[https://reacttraining.com/react-router/web/guides/code-splitting](https://reacttraining.com/react-router/web/guides/code-splitting)


## Other React Things to Know

1. Server-side Rendering
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
