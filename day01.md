# Day 1 – Working w/ an IDE and ES 2015

## Atom: Our IDE

## ES 2015

## Exercises!

To learn what we've done, take the last 45 minutes or so of class to work through some exercises designed to let you work with what we have learend.

You will probably need to use [Ramda](https://ramdajs.com/docs/) to complete, so make sure to check out the documentation!

Create a file in the `day01` folder called `exercises.js` and try your hand at the following challenges:

### Find the Longest Word in a Sentence

Write a function, named `longestWord` (and `export` it), that takes a string as a parameter and returns the longest word in the sentence. If there are two or more words in the sentence of the same length, return the first alphabetically.

Here are some example outputs:

* `'This is a sentence' => 'sentence'`
* `'Equal word size' => 'size'`
* `'Ignore comma.' => 'Ignore'`
* `'ignite Ignite' => 'ignite'`
	* (why is this important?)

#### Questions to Consider

* How do we extract words from a string?
	* We may need a Regular Expression for this
* How do we sort the words?
	* By length?
	* Alphabetically?

### Reverse an Array of Strings

Write a function, named `reverseStrings` (and `export` it), that will take an array and will, for each string in the array, reverse the string.

Here are some example outputs:

* `['bar', 'baz'] => ['rab', 'zab']`
* `[] => []`
* `[0, 1, 2] => [0, 1, 2]`
* `[0, 'foobar'] => [0, 'raboof']`

#### Questions to Consider

* How do you reverse a string?
* How do you detect if something is a string?
* How do we apply something to the whole of an array?

## Homework! (sorry)

Because the wi-fi gets a little spotty at DHSI, I would ask you to download some software for tomorrow after class is over. We will be working with a Vue.js starter project template and it has a lot of dependencies to download. So, you will want to start that tonight (mostly because the wifi in the dorms will be faster than it is in our building).

In your command line, `cd` into your `Projects/` directory. Then, run the following two commands:

* `npm -g install vue-cli` – This command installs Vue's command-line interface.
* `vue init oncomouse/vue-template my-first-vue-app` – This will create a new Vue app in the directory `Projects/my-first-vue-app/`, but you can name the directory whatever you would like.
	* Answer the questions it asks you, but note the following:
	* If you do not have Google Chrome installed, make sure to anser "No" (`n`) to the question "Is Google Chrome Installed?".
	* Make sure to answer "No" (`n`) to the question "Install Vuex (state manager)?"
	* Choose "Yes, use NPM" to the question "Should we run `npm install` for you after the project has been created? (recommended)". This will take a while to finish, but you will be ready to go tomorrow.

Have a wonderful evening and see you tomorrow!