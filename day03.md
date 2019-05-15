# Day 3 – Doing Everything With Style!

As we will talk about numerous times today, CSS (Cascading StyleSheets) is a great technology for styling websites in a structured and logical manner. It was an important web technology when it was developed because it decoupled design from content: HTML was, as it was always intended, a language for describing what the elements of a website were semantically ("this is a heading level 1, this is a paragraph, here's a table!") while CSS told the browser how the designer wanted these individual document elements to appear.

However, one problem that crops up a lot when you dive into contemporary web development is how little the developers of many of these web technologies thought that the Internet would ever be a serious application platform. CSS is especially notable for these sorts of problems (though JavaScript has signs that [it was developed from scratch by one person in 10 days](https://thenewstack.io/brendan-eich-on-creating-javascript-in-10-days-and-what-hed-do-differently-today/)). Particularly, as we will see today:

1. Everything is stored in a global namespace
1. CSS Parser is inefficient on long selectors
1. There are no variables and no control structures
1. Because of #3, there is no way to patch old versions of CSS (a la JavaScript)

We'll be looking first at strategies for writing CSS that address #1 and #2 before looking at technologies that use pre-processors to address #3 and #4.

The big thing we'll be learning today is that CSS lets you build very complex designs quickly and easily but without investigating in best practices in advance, large CSS projects can quickly get out of control. CSS, even more than JavaScript and React, is a technology where you will probably want to invest (time and energy, not money) in a scheme to manage your code. While all of the things we will be talking about today have downsides (in terms of complexity, additional project size, or learning a new paradigm), the alternative is to have CSS that is difficult to manage in the long term.

## Some Suggested CSS Rules

Source: [https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06](https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06)

1. Classes and IDs are lower-cased words separated by hyphens.
1. CSS Rules should be each on a new line, separated by commas.
1. CSS Selectors should be separated by 1 blank line.
1. All CSS Rules should have two elements; if not, refactor.

## Managing CSS Components: BEM Rules

BEM stands for **B**lock, **E**lement, **M**odifier. It is a hierarchical, logical, and predictable way to name classes in CSS.

* **Blocks** are conceptual components on a page, such as `header`, `card`, or `navbar`.
	* Blocks are named in lowercase, with hyphens between words.
* **Elements** are smaller items contained in a Block, such as `header__title`, `card__image`, or `navbar__widget`.
	* Elements are named in lowercase, with the name of their parent block followed by two underscores, followed by the name of the element (which is in lowercase with hyphens between words).
* **Modifiers** represent special states applied to Blocks or Elements, such as `button--warning` or `navbar__widget--night-mode`.
	* Modifiers are applied in addition to the regular Block or Element identifier.
	* Modifiers are the name of the Block or Element followed by two hyphens, followed by the name of the modifier (which is, like everything else, written in lowercase with hyphens between words)

A couple of other rules for BEM:

* No element literals or IDs used in CSS; *everything* is addressed with classes.
	* This allows for reusability of CSS in case the underlying HTML has to change.
* Biggest challenge in BEM (and a source of debate amongst its users) is when an Element can instead by considered a Block.
	* Best advise is if you see yourself reusing the Element outside its associated Block, think about making it a B
	Block.

Sample BEM code:

~~~css
.form {
	margin: 1rem;
}

.form__formset {
	border: 1px solid #eee;
}

.form__input {
	border: 0;
	border-bottom: 1px solid #666;
}

.form__label {
	font-size: 0.9rem;
	padding-right: 0.5rem;
}

.form__submit {
	display: block;
	margin: auto;
}
~~~

And the HTML that uses it:

~~~html
<form class="form">
	<div class="form__formset">
		<label for="name" class="form__label">Enter Your Name:</label>
		<input type="text" class="form__input" name="name" />
	</div>
	<div class="form__formset">
		<label for="age" class="form__label">Enter Your Age:</label>
		<input type="number" class="form__input" name="age" />
	</div>
	<div class="form__formset">
		<button type="submit" class="form__submit">Verify</button>
	</div>
</form>
~~~

### CSS and Namespacing

One problem with CSS is it's global namespace, which means that every class, ID, and element rule you define in your CSS is placed into the same global lexicon. If you define a rule for a BEM Block called `.button` for use in one part of your project and then some other developer comes along and defines a BEM Block called `.button` for their part of the project, these two rules will collide in the global namespace of CSS.

Large projects address this by writing generalizable CSS modules that are then used across a project or by writing more specifically named classes (often using some kind of scoping system). The important point is CSS can get very chaotic quickly and when working in a team, it's good to have a style guide or set of standards for naming worked out in advance.

### CSS Namespacing with Create React App

Create React App supports what are called [CSS Modules](https://github.com/css-modules/css-modules). These load CSS as a JavaScript object instead of simply injecting a `<style>` tag into your document.

Any CSS or SCSS file with a `.module.css` or `.module.scss` extension can be loaded as a module. Instead of simply importing the file, you import an object, usually named `styles`. The keys on the `styles` object are equal to the classes defined in the CSS file, so you use those as your classNames (remembering that we are using a computed value instead of a string).

~~~javascript
import React from 'react';
import styles from './Form.module.css';

const Form = () => (
  <form className={styles.form}>
    <div className={styles['form__formset']}>
      <label for="name" className={styles['form__label']}>Enter Your Name:</label>
      <input type="text" className={styles['form__input']} name="name" />
    </div>
    <div className={styles['form__formset']}>
      <label for="age" className={styles['form__label']}>Enter Your Age:</label>
      <input type="number" className={styles['form__input']} name="age" />
    </div>
    <div className={styles['form__formset']}>
      <button type="submit" className={styles['form__submit']}>Verify</button>
    </div>
  </form>
);

export default Form;
~~~

Why would we do that? It seems like a pain, right?

If we look at this code in the browser, we see the following:

~~~html
<form class="Form_form__1Ddds">
    <div class="Form_form__formset__3KI_q">
        <label for="name" class="Form_form__label__1RIzs">Enter Your Name:</label>
        <input type="text" class="Form_form__input__2A-iN" name="name">
    </div>
    <div class="Form_form__formset__3KI_q">
        <label for="age" class="Form_form__label__1RIzs">Enter Your Age:</label>
        <input type="number" class="Form_form__input__2A-iN" name="age">
    </div>
    <div class="Form_form__formset__3KI_q">
        <button type="submit" class="Form_form__submit__1kRF6">Verify</button>
    </div>
</form>
~~~

The CSS Module loader used by Create React App has added some hash information to prevent namespace collisions.

So, while CSS Modules are a bit of a pain, they can be useful if you have issues regarding namespace.

The React ecology has a variety of JavaScript tools that address the chaos that can result in building large applications. However, as with CSS Modules and everything else we'll talk about today, tools that are more complicated than loading CSS into the global namespace are all going to add a degree of complication to your coding. Part of managing a React project is choosing tools whose inconveniences do not exceed their benefits. You may not need anything we talk about from here on out (CSS Modules, SASS, or CSS-in-JS) for most simple React projects, but a big project will most likely require something like this.

## Adding SASS to React

SASS stands for Syntactically Aware StyleSheets.

To add SASS support to Create React App, run `npm install node-sass` (but our sample project already has it loaded) and if you rename any files with a `.css` extension to a `.scss` extension, they will be processed by SASS.

## What Does SASS Offer?

SASS's big advantage over CSS is programmability. SASS is a programming language, while CSS is merely a mark-up language. The difference between the two is the presence or absence of loops and variables, which SASS adds to CSS syntax.

### Variables

### Mixins

### Functions

### Control Structures

## Organizing SASS Projects

### Variables

### Mixins

## SASS Rules

1. Use variables for z-index scale, colors, fonts
## Emotion.js

[Emotion](https://emotion.sh/) is a CSS-in-JS framework, which lets us write CSS in JavaScript and use it directly with our React components. Instead of having a separate CSS file, the CSS lives right in the JS code.

There are a couple different ways to use it. The core model uses a custom JSX renderer to add a `css` prop to all React components and a `css` function to fill that prop.

For instance,

~~~javascript
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const StyledComponent = () => {
  return (
    <div css={css`
      margin: auto;
      width: 500px
    `}>
      <h1 css={css`color: hotpink;`}>Title</h1>
    </div>
  );
}
~~~

You can also use Emotion's `styled` interface to make new, reusable components

For instance, here's a quick, pink button:

~~~ javascript
import React from 'react';
import styled from '@emotion/styled';

const Title = styled.h1`
  color: hotpink;
`;

const Container = styled.div`
  margin: auto;
  width: 500px;
`;

const StyledComponent = () => {
  return (
    <Container>
      <Title>Title</Title>
    </Container>
  );
}
~~~

If you need global styles, you can use the `Global` component in React:

~~~javascript
import React from 'react';
import { Global, css } from '@emotion/core';

const App = () => {
  return (
    <div>
      <Global styles={css`
        body {
          background: black;
          color: white;
      `} />
    </div>
  )
}
~~~

Just like with functional composition, you can use Emotion to compose CSS:

~~~javascript
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const danger = css`
  color: red;
`;

const base = css`
  background-color: darkgreen;
  color: turquoise;
`;

const StyledComponent = () => {
  return (
    <div>
      <div css={base}>This will be turquoise</div>
      <div css={[danger, base]}>
          This will be also be turquoise since the base styles
          overwrite the danger styles.
      </div>
      <div css={[base, danger]}>This will be red</div>
    </div>
  )
}
~~~

Emotion can also nest selectors like in SASS:

~~~javascript
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const paragraph = css`
  color: turquoise;

  a {
    border-bottom: 1px solid currentColor;
    cursor:pointer;
  }

  header & {
    color: green;
  }
`
render(
  <header>
    <p css={paragraph}>
      This is green since it's inside a header
    </p>
  </header>
  <p css={paragraph}>
    Some text. <a>A link with a bottom border.</a>
  </p>
)
~~~

* Why would we use Emotion?
* What could be problems associated with it?

## SCSS/CSS Frameworks

There are *many* different approaches to building websites using DRY CSS code. The most famous is probably Bootstrap, which offers a really easy-to-use set of components and utility CSS for rapidly building functional websites. The downside for Bootstrap is that, as it becomes more popular, websites start to resemble one another.

### Using SCSS w/ CRA

* [Bootstrap](https://getbootstrap.com/)
* [Foundation](https://foundation.zurb.com/)
* [Cutestrap](https://www.cutestrap.com/)
* [Sierra](http://sierra-library.github.io/)
* [Hocus Pocus](https://bkzl.github.io/hocus-pocus/)

### Functional CSS Libraries

As with functional composition and style composition in Emotion, some web designers have begun to think in terms of functional CSS, which is to say a series of standardized classes that add certain small features to HTML elements that, when added together, produce a more complex behavior.

Here's an HTML example using Tachyons:

~~~html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>TACHYONS - Buttons | Basic Rounded Extra Small</title>
		<meta name="description" content="Tachyons Component">
			<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<meta name="author" content="@mrmrs">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css">
	</head>
	<body class="w-100 sans-serif bg-white pt5">
		<div class="ph3">
			<a class="f6 link dim br1 ph3 pv2 mb2 dib white bg-navy" href="#0">Button Text</a>
			<a class="f6 link dim br1 ph3 pv2 mb2 dib white bg-dark-blue" href="#0">Button Text</a>
			<a class="f6 link dim br1 ph3 pv2 mb2 dib white bg-dark-green" href="#0">Button Text</a>
		</div>
	</body>
</html>
~~~

Breaking down the classes on the `<a>` tags:

* `f6` - Sets the font size (to 6, which is a defined scale of values)
* `link` - Sets basic link behavior
* `dim` - Dims the button on mouseover
* `br1` - Sets a rounded border-radius
* `ph3` - Sets horizontal padding
* `pv2` - Sets vertical padding
* `mb2` - Sets bottom margin
* `dib` - Sets `display: inline-block`
* `white` - Sets `color: white`
* `bg-` - Sets the background to various colors

And so on and so forth. Tachyons adds a lot of `class=""` props to your HTML (or JSX in React) but the CSS for your entire application is of a fixed (and relatively small) size.

Also, as with the SCSS frameworks above, Tachyons is available [as a SASS library](https://github.com/tachyons-css/tachyons-sass) so you can customize the sizing scales, fonts, and colors.

Tachyons are also fairly easy to incorporate into a React project. Just include the CDN link (`https://unpkg.com/tachyons/css/tachyons.min.css`) in `public/index.html` inside the `<head>` tag and use strings of Tachyons as `className` props for your React components:

~~~javascript
import React from 'react';

const BUTTON_TACHYONS = 'f6 link dim br1 ph3 pv2 mb2 dib';
const CONTAINER_TACHYONS = 'ph3';

const ButtonBar = (props) => {
  const {
    buttons
  } = props;
  
  return (
    <div className=`CONTAINER_TACHYONS`>
      {
        buttons.map((button, i) => (
          <a
            className={`${BUTTON_TACHYONS ${button.color || white} bg-${button.background || black}`}
            href={button.href}
          >{button.text}</a>
        )
      }
    </div>
  );
}

~~~

Links:

* [BassCSS](https://github.com/basscss/basscss)
* [Tachyons](http://tachyons.io/)

#### Background Info

* [What is Functional CSS?](https://jon.gold/2015/07/functional-css/)
* [CSS and Scalability](http://mrmrs.cc/writing/2016/03/24/scalable-css/)
* [Rationalizing Functional CSS](https://marcelosomers.com/writing/rationalizing-functional-css/)

## Exercises!
