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

The function has a very particular return type: if the action is of a type the reducer cares about, it *returns a copy* of state having been updated based on the action. If the action is of a type the reducer does not care about, it returns state unchanged.


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

[Formik](https://jaredpalmer.com/formik/) is a form abstraction layer for React. It doesn't do anything fancy (there are some very fancy React form libraries) but it lets write DRY forms.

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
