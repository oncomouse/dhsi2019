# React Class Syntax

When React was first released, components were defined as object classes and each component instance was derived from a particular class. As React has matured, the community and the library's developer have slowly realized that the paradigm of classes and instances is inaccurate and misleading for how React works and how it is most often used.

As I mentioned in the Day 2 lecture notes, React is more easily understood as a function that translates props into HTML. However, the class syntax was already widely distributed. Additionally, it is only the most recent version of React that we get functional hooks, which means that everything done in React classes can now be done in a function.

However, it's probably worth being familiar with the class syntax.

## A Simple Example

We've seen this counter example before, but here it 
~~~javascript
import React from 'react';

class Button extends React.Component {
    render() {
        const {
            clickHandler,
            children,
            ...otherProps
        } = this.props;
        return(
            <button onClick={clickHandler} {...otherProps}>{children}</button>
        )
    }
}

class Counter extends React.Component {
    state = {
        count: 0
    };

    decrement = () => this.setState(({ count }) => ({
        count: (count - 1)
    }));

    increment = () => this.setState(({count}) => ({
        count: (count + 1)
    }));

    reset = () => this.setState({
        count: 0
    });

    render() {
        const {
            count
        } = this.state;

        return (
            <div>
                <Button clickHandler={this.decrement}>-</Button>
                <span>{count}</span>
                <Button clickHandler={this.increment}>+</Button>
                <br />
                <Button clickHandler={this.reset}>reset</Button>
            </div>
        )
    }
}

export default Counter;
~~~

## Lifecycle Methods

The selling feature, even after the arrival of functional components, for React classes was what are called "lifecycle methods." Class components have a series of methods that trigger at particular moments in a components life. For instance, `componentWillMount` is called after a component has been created but before it has first been rendered. Similarly, `componentDidUpdate` would be called after a component has re-rendered following an update.

These methods were designed to manage things such as subscribing to an API or updating a non-React component. However, in practice, they were hard to keep track of and hard to manage conceptually. React effects are much better for linking these kinds of side effects together conceptually instead of tying them to a difficult to remember lifecycle.

If you want to read more about React class syntax, see [Components and Props](https://reactjs.org/docs/components-and-props.html) and [State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html) in the React docs.
