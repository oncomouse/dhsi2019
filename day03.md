# Day 3 – Doing Everything With Style!

## Styling React

## CSS Modules

## Emotion.js

[Emotion](https://emotion.sh/) is a CSS-in-JS framework, which lets us write CSS in JavaScript and use it directly with our React components. Instead of having a separate CSS file, the CSS lives right in the JS code.

For instance, here's a quick, pink button:

~~~ javascript
import styled, { css } from 'react-emotion'

const Button = styled('button')`
  color: hotpink;
`

render(<Button>This is a hotpink button.</Button>)
~~~

To install, run `npm install emotion react-emotion`.

## SCSS Frameworks

### Using SCSS w/ CRA

* [Bootstrap](https://getbootstrap.com/)
* [Foundation](https://foundation.zurb.com/)
* [Cutestrap](https://www.cutestrap.com/)
* [Sierra](http://sierra-library.github.io/)
* [Hocus Pocus](https://bkzl.github.io/hocus-pocus/)

### Functional CSS Libraries

* [BassCSS](https://github.com/basscss/basscss)
* [Tachyons](http://tachyons.io/)

#### Background Info
* [What is Functional CSS?](https://jon.gold/2015/07/functional-css/)
* [CSS and Scalability](http://mrmrs.cc/writing/2016/03/24/scalable-css/)
* [Rationalizing Functional CSS](https://marcelosomers.com/writing/rationalizing-functional-css/)
