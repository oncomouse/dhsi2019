# Day 1 – Working w/ an IDE and ES 2015

## Atom: Our IDE

## ES 2015

## Exercises!

To learn what we've done, take the last 45 minutes or so of class to work through some exercises designed to let you work with what we have learend.

You will probably need to use [Ramda](https://ramdajs.com/docs/) to complete, so make sure to check out the documentation!

If you want an extra challenge, all of these challenges can be completed in the point-free style, if you want to try writing in that manner.

To see if your functions are working, run `npm run day01:test` to check your work.

Create a file in the `day01` folder called `exercises.js` and try your hand at the following challenges:

### Lots of Smiles

Write a function named `lotsOfSmiles` (and `export` it) that takes an array of numbers and returns a string containing a number of smile emoji (😀) equal to the sum of all the numbers.

Some sample output:

* `[1, 2, 3] => "😀😀😀😀😀😀"`
* `[0] => ""`
* `[4, 5] => "😀😀😀😀😀😀😀😀😀"`

#### Questions to Consider

* How do we add together all the numbers in an array?
	* Check the Ramda docs, we may be able to DRY this one.
* How do we generate the emoji?
* How do we make everything into a string?

### Find the Longest Word in a Sentence

Write a function named `longestWord` (and `export` it) that takes a string as a parameter and returns the longest word in the sentence. If there are two or more words in the sentence of the same length, return the first alphabetically.

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

### Reverse Strings in an Array

Write a function named `reverseStrings` (and `export` it) that will take an array and will, for each string in the array, reverse the string.

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

Because the wi-fi gets a little spotty at DHSI, I would ask you to download some software for tomorrow after class is over. We will be working with a React.js starter project template and it has a lot of dependencies to download. So, you will want to start that tonight (mostly because the wifi in the dorms will be faster than it is in our building).

In your command line, `cd` into your `Projects/` directory. Then, run the following command:

* `npx create-react-app my-first-react-app`

Have a wonderful evening and see you tomorrow!
