# Code Formatting Guidelines

## Rationale is required

If no rationale for a guideline can be described,
the guideline cannot be enforced.

## Use preferred code formatting tool

Many programming languages have a preferred code formatter.
In JavaScript/TypeScript this is Prettier.
In Go this is gofmt.

Consistency is more important than personal preferences.

Code formatters can often be integrated into editors so
formatting is performed automatically when code is saved.
Use this feature. It will save time and acclimate you
to the accepted code formatting of the community.

Use default settings unless they are wrong.
They are wrong if the majority of that
programming language community disagrees with it.
For example, the Prettier default of using
double quotes for string delimiters is wrong.

Any formatting done by the code formatting tool
takes precedence over the guidelines that follow.

## Alphabetize all the things

Alphabetical ordering is better than random ordering.
It allows developers to make an educated guess about whether they
will find something before or after the current thing they are viewing.

Examples of things to alphabetize include imports, variable declarations,
function definitions, properties/fields/attributes within a class,
methods within a class, and CSS selectors.

Imports should be alphabetized by the path from which to import,
not by the names of things being imported.
But in languages that allow importing specific things
from a library, alphabetize those.
For example, in JavaScript these imports are correctly alphabetized.

```js
import {Blue, Green, Orange, Purple, Red, Yellow} from 'color';
import {alpha, beta, gamma} from 'greek';
```

Note that "color" comes before "greek".

Another point about alphabetizing is that when adding code later
you don’t have to give much thought about where it goes.
It is obvious according to alphabetizing within similar things.

## Group similar things

Examples of "similar things" include imports, constants,
function definitions, instance variables, static variables, and methods.

In many programming languages, features imported from third party libraries
can be overridden by application-specific code.
Import from third party libraries before
importing from application-specific libraries.

## Let it breathe

Separate different kinds of things by a blank line.
This provides visual separation similar to paragraphs in a book
that allow the brain to detect that it has finished reading
one kind of thing and is beginning to read a new kind of thing.

Never include more than one consecutive blank line
because of the next guideline.

## Value vertical space

The ability to debug a piece of code with minimal scrolling is valuable.

This drives the desire to put the opening curly brace of a block
on the same line as the code that precedes it. For example:

```js
if (temperature > 80) {
    ...
}
```

This also drives the desire to use a single line
for a construct when it is not too long. For example:

```js
if (temperature > 80) console.log(‘It is hot!’);
```

It is acceptable to not wrap the code for a conditional statement
in curly braces when the entire expression fits on one line.
Sure, if you need to add another statement later
then you will have to add the curly braces.
But that's a small price to pay for the savings
in vertical space that are gained by not using curly braces.

## Value terseness when it doesn’t harm readability

One example of valuing terseness is in conditional logic.
This is verbose conditional logic:

```js
let assessment;
if (temperature < 30) {
  assessment = 'cold';
} else if (temperature > 80) {
  assessment = 'hot';
} else {
  assessment = 'just right';
}
```

This is terse conditional logic:

```js
const assessment =
  temperature < 30 ? 'cold' : temperature > 80 ? 'hot' : 'just right';
```

Arrow functions are all the rage in JavaScript
and they are a wonderful thing.
But which if these is more terse?

```js
const myFunction = (arg1, arg2) => {
  // some code here
};

function myFunction(arg1, arg2) {
  // some code here
}
```

Instinct says that the arrow function is more terse because
it doesn't require the seven-letter keyword "function".
But the keyword "const" and the arrow surpass that in length.
In addition, the "function" form screams out
that a function is being defined and
it doesn't require a semicolon after the closing brace.

## Embrace the boolean type

This code does not embrace the boolean type:

```js
const isHot = temperature > 80 ? true : false;
```

This code does embrace the boolean type:

```js
const isHot = temperature > 80;
```

## Don’t make lines too long

Sure, many of us have very wide monitors now.
But the human brain struggles to read long lines.
This is why newspapers print stories in columns
that do not span the entire width of the page.

You might think a line width of 80 characters is a relic of time
that was only relevant for punch cards.
But it’s actually a reasonable width for humans to read comfortably.

In addition, most developers use editors that allow
viewing multiple source files side-by-side.
With line lengths are longer than 80 characters,
doing this will cause many lines to wrap
which makes them even harder to read.

Let your code formatter enforce a maximum line length of 80.
