# Advanced React

## How Do We Exchange Data Between Components?

### Passing Down Props

### Unstated to the Rescue

[Unstated](https://github.com/jamiebuilds/unstated)

~~~javascript
import React from 'react';
import { render } from 'react-dom';
import { Subscribe, Container, Provider } from 'unstated;

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

## How Do We Handle Forms?

### The React Way

~~~javascript
import React, { useState } from 'react';

const Form = (props) => {
    const {

    } = props;

    return (
        <form onSubmit={handleFormSubmit}>
            <label>First Name</label>
        </form>
    )
}
~~~

### Final Form to the Rescue

[React Bindings for Final Form](https://github.com/final-form/react-final-form)

### Formik!

