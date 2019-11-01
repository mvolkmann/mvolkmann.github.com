# Off Topic Stuff

## Difference between attributes and properties (or props)

"Attributes" are specified on HTML elements.
"Properties" exist on DOM elements.

Some DOM properties get their initial value from an HTML attribute.
Some of these DOM properties can be modified,
but attribute values never change.

Some HTML attributes do not have a corresponding DOM property.
An example is the HTML attribute `colspan`.

Some DOM properties do not have a corresponding HTML attribute.
An example is the DOM property `textContent`.

## Public REST Services

opentdb.com provides configurable trivia questions
for building trivia apps.

## Shuffling Arrays

A good approach is:

```js
const shuffle = arr => arr.sort(() => Math.random() - 0.5);
```
