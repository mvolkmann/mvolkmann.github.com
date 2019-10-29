# TypeScript: The Good Parts

In his book, _JavaScript: The Good Parts_, Douglas Crockford
states, "In JavaScript, there is a beautiful, elegant, highly expressive
language that is buried under a steaming pile of good intentions and blunders."

The combination of features added to JavaScript in ES2015 (ES6) and beyond
plus the use of ESLint make JavaScript quite a nice language.

TypeScript is a superset of the JavaScript language.
Therefore it contains the same beautiful features and blunders
that are present in JavaScript.
But it also adds many features,
some of which are beautiful and some not so much.

This article presents the most valuable parts of the TypeScript language.
At the end it lists features that most developers should avoid.

## Overview

TypeScript adds types and more to JavaScript.
Types can be added gradually.
Specifying more types allows TypeScript to find more errors.

TypeScript source files have a file extension of `.ts`
(or `.tsx` if they contain JSX).
These files are compiled to `.js` files.

The TypeScript compiler requires Node.js to be installed in order to run.

TypeScript was developed and maintained by Microsoft.
See <https://www.typescriptlang.org/>.

## Assumptions

This article assumes knowledge of JavaScript
and focuses on the features that TypeScript adds.

Experience with a language that has classes and interfaces
like C# or Java is helpful.

The example code here assumes that the most strict
TypeScript settings possible are in effect.
Otherwise some errors described here will not be reported.

## Benefits

TypeScript provides many benefits.

- catches errors at compile-time
- provides documentation
- allows editors to flag errors while typing and provides completion
- makes refactoring less error-prone
- makes some tests unnecessary
- disallows many JavaScript type coercions

One of the criticisms of JavaScript is that many seemingly invalid expressions
actually produce a result rather than trigger an error at runtime.
For a humorous summary of some of these, see Gary Bernhardt's
"WAT" talk at <https://www.destroyallsoftware.com/talks/wat>.

TypeScript addresses most of these issues by
disallowing many type coercions that JavaScript allows.
For example, TypeScript allows adding a number and a string
(resulting in concatenation), but it
does not allow adding an object and a number.

## Creating a TypeScript Project

Let's get started by creating a TypeScript project.
Here are the steps:

1. Install Node.js from <https://nodejs.org>.
1. Create a directory for the project and `cd` to it.
1. Create a `package.json` file by running `npm init`.
1. Locally install the TypeScript compiler and optionally the type definitions
   for Node by running `npm install -D typescript @types/node`.
1. Create a `tsconfig.json` file by running `npx tsc --init`.  
   This file created will contain many commented-out options.  
   `npx` searches in `./node_modules/.bin` for executables installed by `npm`.  
   `tsc` is an abbreviation for "TypeScript Compiler".
1. Modify `tsconfig.json` to match the starting point described in the next section.
1. Create a `src` directory at the top of your project directory.
1. When you are ready to create new `.ts` files,
   place them in and under the `src` directory.
1. Add the following npm script in `package.json`:  
   `"compile": "tsc",`
1. Compile all your `.ts` files to `.js` files by running `npm run compile`.  
   This compiles all the `.ts` files under the `src` directory
   to `.js` files under the `dist` directory.
1. Run the main `.js` file by entering `node dist/index.js`.  
   This assumes the main `.ts` file is `src/index.ts`.

To see the version of TypeScript that is installed,
enter `npx tsc -v`.

## TypeScript Configuration

The file `tsconfig.json` contains configuration options for the TypeScript compiler.
It is only used when `tsc` is run with no specified input files,
which compiles all TypeScript files in a project.

Some top-level properties are `compilerOptions` and `include`.
Others include `compileOnSave`, `exclude`, `extends`, and `files`.
A good starting point for this file is:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "module": "commonjs",
    "noImplicitReturns": true,
    "outDir": "dist",
    "strict": true,
    "target": "es5",
 }
  "include": ["src"]
}
```

The option `compilerOptions` is an object with many properties including:

- `esModuleInterop`  
  This allows the use of ES5 default exports and imports.
- `jsx`  
  Ignore this option when not using JSX.
  Valid values are `"preserve"`, `"react"`, and `"react-native"`.
- `lib`  
  This is an array of APIs assumed to exist.  
  For example: `["dom", "es2015"]`
- `module`  
  This specifies the module system to use.  
  For example, use `"es2015"` for modern browsers
  or `"commonjs"` for Node.js.
- `noImplicitReturns`  
  Set this to `true` to require functions that
  return a value to do so from ALL code paths.
- `outDir`  
  This is the directory where `.js` files should be written.
  For example, `"dist"`.
- `sourceMap`  
  Set this to `true` to generate source map files.
  Generating sourcemaps requires installing the npm package `source-map-support`.
- `strict`  
  Set this to `true` to require all code to be typed.
- `target`  
  This specifies the JavaScript version to generate.
  For example, `"es5"` for older browsers
  or `"es2015"` for modern browsers and Node.js.

The option `include` is an array of directories where `.ts` files are found.
For example, `"include": ["src"]`.

## Strict Mode

Setting the `compilerOption` `strict` to `true`
implies many other options listed below.

- `alwaysStrict`  
  This parses in strict mode and
  emits `"use strict"` at the top of each generated `.js` file.
- `noImplicitAny`  
  This raises an error on declarations and expressions
  with an inferred type of `any`.
- `noImplicitThis`  
  This raises an error on `this` expressions
  with an implied type of `any`.
- `strictBindCallApply`  
   This enables stricter checking of the `bind`, `call`, and `apply` methods on functions.
- `strictFunctionTypes`  
  This checks function type parameters covariantly
  instead of bivariantly.
  Suffice it to say, you want this.
  The curious can learn more about these terms from
  Ben Weissmann's Strange Loop talk at
  <https://www.youtube.com/watch?v=uJHD2xyv7xo> and
  <https://codewithstyle.info/Strict-function-types-in-TypeScript-covariance-contravariance-and-bivariance/>.
- `strictNullChecks`  
  This makes `null` and `undefined` values
  disallowed for every type by default.
  With this option, `null` and `undefined` are
  only assignable to themselves and the `any` type
  (except `undefined` is assignable to the `void` type).
- `strictPropertyInitialization`  
  This ensures that class properties with a type that does not
  allow `undefined` are initialized in the constructor.
  It also requires the `strictNullChecks` option.

## TypeScript Flow

At compile-time `tsc`

- reads `.ts` files
- creates an abstract syntax tree (AST)
- performs type checking against the AST
- generates one `.js` file for each `.ts` file

At run-time a JavaScript Engine

- reads `.js` files
- generates a different AST
- generates bytecode from AST
- evaluates the bytecode

Since the JavaScript engine steps are not visible,
it feels like JavaScript is an interpreted language.

## TypeScript Node

Another way to compile and run TypeScript code
in a Node environment is to use `ts-node`
at <https://github.com/TypeStrong/ts-node>.

To install this, enter `npm i -g typescript ts-node`.

To compile and run a TypeScript source file,
enter `ts-node name.ts`.

## Editor Support

The VS Code editor has great TypeScript support.
To enable it, open Settings and check "Typescript > Validate".
Once this is enabled, errors will be detected as you type.
Hover over a variable to see its type.

VS Code doesn't currently honor the
`compileOnSave` setting in `tsconfig.json`.
See <https://github.com/microsoft/vscode/issues/973>.

As a workaround, enter `tsc --watch` in a terminal window
to watch for file changes and automatically compile.

Other editors with TypeScript support include
Atom, Eclipse, Emacs, Sublime, Vim,
Visual Studio, and WebStorm.

## Linting

There are two popular options for linting TypeScript code:
TSLint and ESLint.
TSLint will soon be deprecated in favor of ESLint,
but currently TSLint supports rules
not yet implemented for ESLint.

### TSLint

To install TSLint, enter `npm install -D tslint`.

To generate a default `tslint.json` file
which configures the use of TSLint,
enter `npx tslint --init`.
Edit this file to customize the linting rules.

To run TSLint on all source files in the current project,
enter `npx tslint --project .`.

To run TSLint using an npm script,
add the following line to the `scripts` section
of `package.json`:

```json
  "lint": "tslint --project ."
```

With this in place, TSLint can be run by entering
`npm run lint`.

### ESLint

To install ESLint, enter `npm install -D *`
where `*` is the following:

- `eslint`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `eslint-plugin-react` (only when using React)

Configure ESLint by creating the file `.eslintrc.json`.
A good starting configuration is the following.
Options that include the words "react" and "jsx"
can be omitted when not using React.
The "rules" option is used to override
rules from the "extends" rule sets.

```ts
{
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:react/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx":  true
    }
  },
  "rules": {
  },
  "settings":  {
    "react": {
      "version": "detect"
    }
  }
}
```

To run ESLint using an npm script, add the following
line to the `scripts` section of `package.json`:

```json
  "lint": "eslint --cache --ext=.ts,.tsx --fix src"
```

With this in place, ESLint can be run by entering
`npm run lint`.

## Formatting

The best code formatter for TypeScript is Prettier
at <https://prettier.io/>.

To install Prettier, enter `npm install -D prettier`.

To run Prettier using an npm script, add the following
line to the `scripts` section of `package.json`:

```json
  "format": "prettier --write src/**/*.{ts,tsx}"
```

With this in place, Prettier can be run by entering
`npm run format`.

## Types

Types define allowed values and
operations that can be performed on values.
For example, the number type only allows
integer and floating point values.
One operation that can be performed on numbers is multiplication.

## Type Hierarchy

The diagram below shows the relationships
between the builtin types provided by TypeScript.

![TypeScript Type Hierarchy](./ts-type-hierarchy.png 'TypeScript Type Hierarchy')

## Builtin Types

The primitive types supplied by TypeScript include:

- `boolean` - values are `true` and `false`

- `number` - integers (up to 2^53) and floats

- `string` - text

- `bigint` - holds any size integers  
  As of 8/30/19 this type is not supported by IE11 or Safari.

- `symbol` - holds immutable, unique values  
  These are sometimes used as keys in objects and Maps.

- `null` - typically represents currently having no value

- `undefined` - typically represent having never had a value

Other builtin types include:

- `any` - default type; allows anything  
  It's best to avoid using this.
- `unknown` - like any, but requires "refinement" when values are used  
  Refinement involves checking the type of a variable in code,
  typically using an `if` statement.
- `undefined` and `null`  
   These types are only used in union types, not on their own. For example:

  ```ts
  let name: string;
  //console.log(name); // used before being assigned
  name = 'Tami';
  console.log(name); // Tami
  //name = null; // not assignable

  let name2: string | null | undefined;
  console.log(name2); // undefined
  name2 = 'Mark';
  console.log(name2); // Mark
  name2 = null;
  console.log(name2); // null
  ```

- `void`  
  This type is only used as the return type
  of functions that return nothing.

  ```ts
  function printSum(n1: number, n2: number): void {
    console.log(n1 + n2);
  }
  ```

- `never`  
  This type represents something that never happens.
  One use is as the return type of functions that never return.
  It is difficult to think of a useful example.
  You may never use `never`.

## Non-Primitive Types

- objects  
  One form of these is described in the next section.

- arrays  
  These are described later.

- any JavaScript class  
  Examples include `Date`, `Error`, `Function`,
  `Map`, `Promise`, `RegExp`, and `Set`.

## Objects With Unspecified Properties

There are three ways to declare objects
that can hold arbitrary properties.
These are rarely used.
It is more common to specify the allowed properties using
interfaces or type aliases which are described later.

- `object`  
  Variables of this type can be assigned any object or array.

- `Object` or `{}`  
  Variables of these types can be assigned
  any object, array, or primitive value.
  Because primitive values can be assigned,
  these types should be avoided.

Note that `undefined` and `null` cannot be assigned
to variables of any of these types.

## Union Types

Union types define a new type that
matches any of a list of specified types.

Assuming the classes `Dog` and `Cat` are defined,
we can define a `Pet` type as follows:

```ts
type Pet = Cat | Dog;
```

Here is another example:

```ts
type Custom = number | string | undefined;

// If undefined was not an allowed type,
// this would not be assignable.
//let c: Custom = undefined;

let c: Custom;
console.log(c); // undefined

c = 1;
console.log(c); // 1
c = 'x';
console.log(c); // x
//c = true; // not assignable
//c = null; // not assignable
```

## Enums

Enum types define a list of allowed `number` or `string` values.
They are like objects where keys are strings
and values are numbers or strings.

By default values are integers starting from zero.
Specific `number` or `string` values can be assigned.
It is even possible to mix `number` and `string` values
in the same `enum`, but doing this is not typical.

When the values are numbers,
their keys can be retrieved by value.
This cannot be done when the values are strings.

Here are some examples:

```ts
// number enum
enum Color {
  Red, // 0
  Green = 10, // 10
  Blue // 11; next value after Green
}
let c: Color = Color.Blue;
console.log(c); // 11
c = 10; // can set number value
console.log(c); // 10
c = 30; // can set number value not present
console.log(c); // 30, not an error
//c = Color.Yellow; // error, does not exist
console.log(Color[10]); // Green
console.log(Color[12]); // undefined, not error

// string enum
enum HexColor {
  Red = 'F00',
  Green = '0F0',
  Blue = '00F'
}
let hc: HexColor = HexColor.Blue;
console.log(hc); // 00F
//hc = 1; // error, not assignable
hc = HexColor.Red;
console.log(hc); // F00
//hc = HexColor['0F0']; // error, property does not exist
```

When an `enum` type is declared as `const`,
values can be accessed by key,
but keys cannot be accessed by value.
A benefit of using `const` enums is that the
TypeScript compiler can inline member references.

```ts
const enum ConstColor {
  Red,
  Green,
  Blue
}

const cc: ConstColor = ConstColor.Blue;
console.log(cc); // 2
//console.log(ConstColor[1]); // can only access by key
console.log(ConstColor.Green); // 1
console.log(ConstColor['Green']); // 1
```

Many developers prefer using union types instead of enums.
For example:

```ts
// Instead of this enum ...
const enum Color {
  Red,
  Green,
  Blue
}

// can use this union type.
type Color = 'red' | 'green' | 'blue';

let c: Color = 'red';
c = 'pink'; // "pink" is not assignable
```

One reason for this is that enums with number values
allow any number to be assigned.
For example:

```ts
const enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Red; // valid value
c = 19; // not a valid value, but allowed
```

## Arrays

Array types have the syntax `type[]` or `Array<type>`.
Their type can also be inferred from an initial value.
For example:

```ts
const things = [99, 'Gretzky']; // type is (string | number)[]
```

While an array type can allow elements with different types,
it is best to use a common type for all elements
so TypeScript can better enforce their usage.

The type of an untyped array is narrowed when
it leaves the scope in which it was created.
For example:

```ts
function getThings() {
  const arr = []; // type is any[]
  arr.push(1);
  arr.push('x');
  return arr; // type is (string | number)[]
}

const things = getThings(); // type is (string | number)[]
things.push(new Date()); // error: not a string or number
```

## Tuples

Tuples are a subtype of arrays.
They have a fixed length and a specific type at each index.
For example:

```ts
type Point = [number, number];

function translate(point: Point, dx: number, dy: number): Point {
  const [x, y] = point; // destructuring
  return [x + dx, y + dy];
}

const p1: Point = [1, 2];
const p2 = translate(p1, 2, 3);
console.log(p2); // [3, 5]
```

The element at each index can hold a different type (heterogeneous).
Particular elements can be made optional by adding `?` after their type.
For example:

```ts
type PlayerScore = [string, number?];
```

It is often preferred to use an interface instead of a tuple
so that each piece of data has a name.
For example:

```ts
// Using a tuple
type PlayerScore = [string, number];
const ps: PlayerScore = ['Mark', 19];

// Using an interface is usually better.
interface Player {
  name: string;
  score: number;
}
const p: Player = {name: 'Mark', score: 19};
```

## `readonly` Modifier

The `readonly` modifier can be applied to array types, tuple types, and object properties inside interfaces or type aliases.
This prevents their values from being modified, making them "immutable".
For example:

```ts
type Numbers = readonly number[]; // primitive array
const n: Numbers = [1, 2, 3];
//n[1] = 7; // only permits reading
//n.push(4); // property "push" does not exist on readonly arrays

type Dates = readonly Date[]; // object array
const d: Dates = [new Date()];
//d[0] = new Date(); // only permits reading

type PlayerScore = readonly [string, number, Date]; // tuple
const ps: PlayerScore = ['Mark', 19, new Date()];
//ps[1] = 20; // cannot assign to read-only element

type Lines = string[];
// Can't apply readonly to a type alias,
// only to array and tuple literal types.
//const lines: readonly Lines = ['one', 'two'];

// Can apply to individual properties of object types.
interface ImmutablePoint {
  readonly x: number;
  readonly y: number;
  readonly d: Date;
}

const p1: ImmutablePoint = {x: 1, y: 2, d: new Date()};
//p1.x = 3; // cannot assign to read-only property
//p1.d = new Date(); // cannot assign to read-only property
```

## Generic Types

Generic types can be used in functions,
type aliases, classes, interfaces, and methods.

"Type parameters" are names used for
parameter types, return types, and variable types.
They are specified in angle brackets (e.g., `<T, U>`).
There can be any number of type parameters
and they can be given any names,
but common names are `T`, `U`, and `V`.
It is rare to need more than three.

All occurrences of a given type parameter
are replaced with the same type at runtime.
TypeScript can infer type parameter types at runtime,
but they can also be made explicit.
We will see many examples of this later.

## `Readonly` Utility Type

`Readonly` is one of the provided utility types.
More are described later.

It creates a new type from an existing one
where all object properties are readonly.
For example:

```ts
interface MutablePoint {
  x: number;
  y: number;
  d: Date;
}

const p2: Readonly<MutablePoint> = {x: 1, y: 2, d: new Date()};
//p2.x = 3; // cannot assign to read-only property
//p2.d = new Date(); // cannot assign to read-only property
```

## Declaring Variables

TypeScript will infer variable types when initial values are assigned.
For example:

```ts
let score = 0; // infers number
const teams = 2; // infers 2, not number, because it’s immutable
```

Variable types can also be specified explicitly.
For example:

```ts
let score: number; // defaults to 0
const teams: number = 2; // no need to specify type here
```

## Type Aliases

Type aliases can give an alternate name to another type.
For example:

```ts
type Age = number;
const myAge: Age = 29;

type Pet = Cat | Dog;
```

Type aliases can also define a type that allows a fixed set of values.
For example:

```ts
type Color = 'red' | 'green' | 'blue';
const color: Color = 'blue';
```

Another use for type aliases is to define an object "shape".
For example:

```ts
type Address = {
  street: string;
  city: string;
  state: string;
  zip: number;
};

const myAddress: Address = {
  street: '123 Some St.',
  city: 'Somewhere',
  state: 'Missouri',
  zip: 12345
};
```

While this works, most TypeScript developers prefer using interfaces
instead of type aliases to defined object shapes.
Interfaces are described later.

Type aliases are block-scoped like `const` and `let`.

## More on Shapes

Object properties described by interfaces and type aliases are required by default.
Also by default, additional properties cannot be added to objects of these types.

To make a property optional, add `?` after its name.

To make a property read-only, add `readonly` before its name.

To allow arbitrary additional properties, add an "index signature".
For example:

```ts
[key: keyType]: valueType
```

`key` can have a different name, but using `key` is common.
`keyType` must be `string` or `number`.
`valueType` can be any type including `any`.
For example:

```ts
type Address = {
  street: string;
  city?: string;
  state?: string;
  readonly zip: number;
  [key: string]: any;
};
```

## Generic Type Aliases

Type aliases can use generic types.
For example:

```ts
type Range<T> = {
  min: T;
  max: T;
};

const numberRange: Range<number> = {min: 1, max: 10};
const letterRange: Range<string> = {min: 'a', max: 'f'};
const teamRange: Range<Team> = {
  min: new Team('Cubs'),
  max: new Team('Cardinals')
};
```

## Function Parameter and Return Types

Function parameter types and return types can be specified
regardless of how the function is defined.
This includes named functions, arrow functions, and function expressions.
For example:

```ts
// Named function
// Same as the JavaScript String repeat method.
function stringRepeat(text: string, repeat: number): string {
  let result = '';
  for (let i = 0; i < repeat; i++) {
    result += text;
  }
  return result;
}

// Example call
const santaSays = stringRepeat('Ho ', 3); // 'Ho Ho Ho '

// Arrow function
const stringRepeat = (text: string, repeat: number): string => {
  // same code as above
};

// Function expression
// Typically the other forms are preferred over this.
const stringRepeat = function(text: string, repeat: number): string {
  // same code as above
};
```

## Function Signature Types

Function signature types define the parameter types and return types
of functions that are defined elsewhere.
For example:

```ts
type StrNumFn = (s: string, n: number) => string;
```

Parameter names are just for documentation.
Implementations can use other names.

Parameter default values cannot be specified in function signatures,
but they can be specified in function definitions.

A return type must be specified, unlike in function definitions
where it can be inferred.

Function signature types can be used as
the type of functions when they are defined.
They can also be used as parameter types when
functions can be passed as an argument to other functions.

Parameter types are not inferred unless the function itself
is typed using a function signature type.
However, in functions that are not typed using a function signature type,
the return type can be inferred by return statements in the body
if the type of each return statement can be inferred.

For example:

```ts
// Based on the use of the StrNumFn type,
// the text parameter type is inferred to be string.
// The repeat parameter type is inferred to be number.
// We could specify parameter default values.
// The return type is inferred to be string.
const stringRepeat: StrNumFn = (text, repeat) => {
  let result = '';
  for (let i = 0; i < repeat; i++) {
    result += text;
  }
  return result;
};
```

Function signature types are useful in functions
that take other functions as arguments.
For example:

```ts
function processStr3(text: string, fn: StrNumFn): string {
  return text.length > 0 ? fn(text, 3) : 'empty';
}
```

## Optional, Default, and Variadic Parameters

To make a parameter optional, add `?` after its name.
This is only allowed for ending parameters.
For example:

```ts
function stringRepeat(text: string, repeat?: number): string { ... };
```

To give parameter a default value, add `= value`.
The parameter type can be inferred from the default value.
Specifying a default value for a parameter is more common than making it optional.
For example:

```ts
function stringRepeat(text: string, repeat = 1): string { ... };
```

Variadic functions, which are functions that
take a variable number of arguments,
are defined using a "rest parameter" at the end
just like in JavaScript.
For example:

```ts
function labeledSum(label: string, ...values: number[]): string {
  return label + ': ' + values.reduce((acc, v) => acc + v);
}
console.log(labeledSum('total', 1, 2, 3)); // total: 6
```

## Functions That Use `this`

In functions that use `this`, the type of `this`
can be declared as if it is the first parameter
even though it is not passed that way.
This is a rarely used feature.
It is better to define the function as a method in a class.
For example:

```ts
type Person = {
  name: string;
  age: number;
};

function greetTeen(this: Person, greeting: string) {
  if (13 <= this.age && this.age <= 19) {
    console.log(greeting, this.name);
  }
}

const p1: Person = {name: 'Dylan', age: 21};
const p2: Person = {name: 'Paige', age: 16};
greetTeen.call(p1, 'Yo'); // no output
greetTeen.call(p2, 'Yo'); // Yo Paige
```

## Overloaded Functions

TypeScript supports overloaded functions.

In other languages that support overloaded functions (not JavaScript),
multiple function definitions with the same name can be written.
When called, the implementation to invoke is determined
based on the argument types.

In TypeScript overloaded functions are described by
type aliases that define all the acceptable function signatures.
But they are all implemented by a single function
whose type is this type alias.
The function must check the types of its arguments
and do the right thing based on those.

If this sounds complicated, it's because it is.
For this reason overloaded functions are rarely used in TypeScript.

## Generic Functions

Generic functions use type parameters to specify the types they should use.
For example, if the builtin `Array` `map` method was written as a function,
it might look like this:

```ts
// The parameter "array" is an array of type T.
// The parameter "fn" is a function that takes an
// argument of type T and returns a value of type U.
// This function calls "fn" on each element of "array"
// and returns an array of the results of these calls.
// The return type is an array of type U.
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of array) {
    result.push(fn(item));
  }
  return result;
}

const numbers = [1, 2, 3]; // type inferred as number[]

const d1 = map(numbers, n => n * 2);
console.log(d1); // [2, 4, 6]

const double = (n: number): number => n * 2;
const d2 = map<number, number>(numbers, double);
console.log(d2); // [2, 4, 6]

const words = ['apple', 'banana', 'cherry'];
const lengths = map<string, number>(words, s => s.length);
console.log(lengths); // [5, 6, 6]
```

The type parameters specified in the calls to the `map` function above
are not needed because they can be inferred from the arguments.

## Classes

Classes provide a template for creating instances using the `new` keyword.
For example:

```ts
class Person {
  name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const p1 = new Person('Dylan', 21);
```

TypeScript supports three access modifiers for class members.

`public` members can be accessed from anywhere.
When no access modifier is specified, this is the default.

`protected` members can be accessed from
all instances of this class and subclasses.

`private` members can only be accessed from instances of this class.

Access modifiers can be applied to constructor parameters
as a short-cut for assigning to instance properties.

For example:

```ts
class Person2 {
  // Shortcut for what Person constructor does.
  // If public is removed from the name parameter,
  // the name instance property will not be set.
  constructor(public name: string, private age: number) {}
}

const p2 = new Person2('Paige', 16);
```

For classes whose constructor does not require parameters,
parentheses are not needed when creating instances with `new`.
However, code formatters like Prettier will add them.
For example:

```text
class Demo {}
const d1 = new Demo;
```

Unlike in JavaScript, classes in TypeScript must declare all properties.
For example, this class in JavaScript:

```js
class Person {
  constructor(name) {
    this.name = name;
  }
}
```

can be written like this in TypeScript:

```ts
class Person {
  name: string; // required

  constructor(name: string) {
    this.name = name;
  }
}
```

or like this:

```ts
class Person {
  constructor(public name: string) {}
}
```

Properties and methods declared with the `static` keyword
are not associated with any instance
and are accessed with the class name.
See the example below.

Instance properties declared with the `readonly` keyword
must set in the constructor and cannot be changed.

For example:

```ts
class Widget {
  private static count: number = 0;
  readonly creationDate: Date;

  constructor() {
    this.creationDate = new Date();
    Widget.count++;
  }

  static getCount() {
    return Widget.count;
  }
}

let w = new Widget();
console.log('first Widget =', w);
w = new Widget();
console.log('second Widget =', w);
w = new Widget();
console.log(Widget.getCount()); // 2
```

Classes can extend one other class to inherit from it.
They can override any of the inherited methods.
For example:

```ts
class Car extends Vehicle { ... }
```

Classes can implement any number of interfaces.
They must implement all methods described in each interface.
For example:

```ts
class Car extends Vehicle implements Recyclable, Sortable { ... }
```

Classes can be marked as abstract when they
are only intended to be used as a superclass.
Abstract classes cannot be instantiated with the `new` keyword.
Extending classes must implement all the methods marked as abstract
or they must also be abstract.
For example:

```ts
abstract class Vehicle { ... }
```

Subclasses must call their superclass constructor
from their constructor with `super(args)`
even if the superclass has no constructor
or has one that doesn’t take arguments.
`super` must be called before using the `this` keyword.
in the constructor.
Subclass methods can call superclass methods with
`super.methodName(args)`.
For example:

```ts
class Car extends Vehicle {
  constructor() {
    super();
    ...
  }

  report() {
    console.log('Car:');
    super.report();
  }
}
```

## Generic Classes

Generic classes support defining classes whose members have specific types
that are specified by code that creates instances of the class.
For example:

```ts
class Pair<T> {
  constructor(public first: T, public second: T) {}
}

const p1 = new Pair<number>(3, 19); // generic type can be inferred
console.log(p1); // Pair { first: 3, second: 19 }
const p2 = new Pair('foo', 'bar'); // inferred generic type is string
console.log(p2); // Pair { first 'foo', second: 'bar' }
//const p3 = new Pair('foo', 1); // error, 1 not assignable to string
```

One example of a builtin generic class is `Promise`.
For example;

```ts
const promise = new Promise<Person>(resolve => {
  // Perhaps retrieve data with a REST call here.
  resolve(new Person(...));
});
const person = await promise;
```

## Interfaces

Interfaces can describe method signatures that implementing classes will implement.
These can only be instance methods, not static.

Interfaces can also describe properties that instances will have.

For example:

```ts
interface Vehicle {
  maxSpeed: number;
  accelerate(speed: number): void;
}
```

Unlike abstract classes, interfaces cannot

- specify access modifiers (all members are `public`)
- define constructor signatures
- define default method implementations

Interfaces are similar to type aliases that describe object shapes.
Both can describe properties and method signatures,
but there are three differences:

1. Interfaces can extend another interface, a type alias, or a class (weird).
   Type aliases cannot.
2. Interfaces can be defined multiple times in the same scope
   and their definitions will be merged. Type aliases cannot.
3. The right side of a type alias can be another type (truly an alias).

The bottom line is that there is no strong reason to
prefer one over the other for defining an object shape.
But it seems the community prefers using interfaces when either will do.

## `Record` Utility Type

Like `Readonly` described earlier, `Record` is one of the provided utility types.
More are described in the next section.

It is used to define a type that is a mapping from a set of keys to values.
The keys must be strings, numbers, or symbols.
The values can be any type.
For example:

```ts
type Fruit = 'apple' | 'banana' | 'cherry' | 'lime';
type Color = 'red' | 'orange' | 'yellow' | 'green' | 'blue';
const fruitMap: Record<Fruit, Color> = {
  apple: 'red',
  banana: 'yellow',
  cherry: 'red',
  lime: 'green' // error if this line is missing
};

const color: Color = fruitMap.banana;
console.log(color); // yellow
```

The benefit of using `Record` over using an `Object` or `Map`
is that it provides "totality checking" (a.k.a exhaustiveness).
This ensures that there is a mapping for all possible keys.

## Additional Utility Types

The "utility types" provided by TypeScript
create a new type based on existing types.
We have already seen `Readonly` and `Record`.
A summary of the rest of them follows.
Note that none of these are used frequently.

- `Partial<T>`  
  This creates a type that is the same as `T`
  except all the properties are optional.
- `Required<T>`  
  This creates a type that is the same as `T`
  except all the properties are required.

- `Pick<T, K>`  
  This creates a type that contains the members of `T`
  that are listed by name in the union type of string literals `K`.
- `Omit<T, K>`  
  This creates a type that contains the members of `T`
  that are not listed by name in the union type of string literals `K`.

- `Extract<T, U>`  
  This creates a type that contains the members of `T`
  that can be assigned to the type `U`.
- `Exclude<T, U>`  
  This creates a type that contains the members of `T`
  that cannot be assigned to the type `U`.

- `NonNullable<T>`  
  This creates a type that is the same as `T`
  except no properties allow the values `undefined` and `null`.
  This considers the type of `T`, but not
  its members like the previous utility types.
  It is used to create a more restrictive
  union type from an existing union type.

The remaining utility types, `ReturnType`, `InstanceType`, and `ThisType`,
seem less useful.

## Bounded Polymorphism

Bounded polymorphism requires a type parameter to be
a type that implements a given interface or extends a given class,
rather than just any type.
Consider the differences between these function and class definitions:

```ts
// Not using bounded polymorphism.
function foo(bar: Bar): Bar { ... }
// Using bounded polymorphism.
function foo<T extends Bar>(bar: T): T { ... }

// Not using bounded polymorphism.
class Foo {
  constructor(bar: Bar) { ... }
}
// Using bounded polymorphism.
class Foo<T extends Bar> {
  constructor(bar: T) { ... }
}
```

In all the cases above, `bar` is an object
that is assignable to the type `Bar`.
In the cases that use `extends` (bounded polymorphism),
the type of `T` is the actual subclass of `Bar` being used.

One example of when this distinction is useful
is when a function must have a return type
which matches that of one of its type parameters.

If this seems confusing it is because it is!
It is hard to come up with a good example where bounded polymorphism is needed.
Typically the difference is not important and the non-generic form is used.

## Structural Typing

When determining object compatibility,
TypeScript uses structural typing,
not nominal typing (by name).
This means compatibility is based on
the properties in an object, not its class.

In the example below, note that the `Cat` and `Dog` classes
have the same properties.

```ts
class Cat {
  constructor(public name: string) {}
}

class Dog {
  constructor(public name: string) {}
}

const cat = new Cat('Whiskers');
dog = cat; // allowed because it has all properties of Dog

const extra = {name: 'Jerry', species: 'mouse'};
dog = extra; // allowed because it has all properties of Dog

const neither = {foo: 'bar'};
//dog = neither; // error: doesn't have all properties of Dog
```

Flow, an alternative JavaScript type checker,
uses nominal typing instead of structural typing.
This means it only allows assignments of `Dog` objects
and objects from `Dog` subclasses
to variables of type `Dog`.

## Script vs. Module Mode

JavaScript source files are evaluated in one of two modes, script or module.
Here are some ways in which modules differ from scripts:

- Modules are always executed in strict mode.
- Modules can use `import` and `export` statements.
- Modules are loaded once regardless of how many times they are imported.
- Top-level definitions in modules have file scope, not global scope.
  They are only accessible outside the file if they are exported.
- The top-level value of `this` in modules is `undefined`, not `window`.

Source files are processed in module mode
if they contain at least one `import` or `export` statement.
When neither kind of statement is needed, module mode can be forced
by including `export {}`, typically at the top of the source file.
This is desirable to avoid conflicts between top-level declarations
of the same names across multiple source files.

## DefinitelyTyped

Many open source libraries include TypeScript type definitions
when they are installed from npm.
When they don’t, often these are available from DefinitelyTyped
which is the "repository for high quality TypeScript type definitions".
See <http://definitelytyped.org/>.

Types from DefinitelyTyped are published in npm under the `@types` scope.
To install type definitions for a library, enter
`npm install -D @types/library-name`.
These type definitions are automatically included by the TypeScript compiler.

To add or correct type definitions in DefinitelyTyped,
submit pull requests.

## Libraries With No Type Definitions

To get type checking for a library that doesn’t provide its own type definitions
and has none in DefinitelyTyped,
you can write the type definitions yourself.

When finished there are three options.

1. Contribute type definitions to the library.
2. Contribute type definitions to DefinitelyTyped.
3. Keep the type definitions in your own project,
   perhaps in the file `src/types.ts`,
   and import them where needed.

## Type Declaration Files

The TypeScript compiler and editors like VS Code
use type declaration files for type checking.

These can be generated from TypeScript source files
using the command `tsc -d name.ts`.

They can also be created manually.
This is typically only done for JavaScript libraries that do not supply them.
Declare all types that should be visible to consuming code,
omitting privately used types.

Type declaration files contain "ambient declarations".
The term "ambient" distinguishes them from normal declarations.

The `declare` keyword is used for every kind of type declaration except interfaces.

The file extension for type declaration files
is `.d.ts` when there is a corresponding `.js` file,
and can be `.d.ts` (preferred) or `.ts` otherwise.

## Ambient Declaration Examples

Here is a sample TypeScript source file
that uses a variety of types:

```ts
export const MONTH = 'April';

export let counter: number = 0;

export function double(n: number): number {
  return n * 2;
}

export type Fruit = {
  name: string;
  color: string;
  volume: number;
};

export interface Sortable<T> {
  sort(): T;
}

export class Person {
  constructor(public name: string, public age: number) {}
}
```

Here is a type declaration file that was generated by
running `tsc -d` on the source file above:

```ts
export declare const MONTH = 'April';
export declare let counter: number;
export declare function double(n: number): number;
export declare type Fruit = {
  name: string;
  color: string;
  volume: number;
};
export interface Sortable<T> {
  sort(): T;
}
export declare class Person {
  name: string;
  age: number;
  constructor(name: string, age: number);
}
```

You can manually create type declarations like these
when no TypeScript source is available.

## Shipping TypeScript Libraries

The steps to ship a TypeScript library
that others can use are as follows:

1. Generate type declarations from TypeScript source files.
2. Add a `types` key in `package.json`.  
   This indicates that type declarations are included.
   Its value is the path to a `.d.ts` file.
3. Add an npm script in `package.json`.  
   This should generate new type declarations every time changes are published.
4. Include source maps.
5. Choose the target module format appropriate
   for code that will use the library.  
   For code targeted at web browsers this is typically "ES5".
6. Omit `.ts` files from the deployed library
   and only include generated `.js` and `.d.ts` files.  
   Including `.ts` files increases the size of the download for little value.
   If `.ts` files are included and generated `.js` files are not,
   users will have to compile them.
   The `.ts` will still be in a repository such as Git.  
   In `.npmignore`, add the `src` directory.  
   In `.gitignore`, add the `dist` directory.

## Migrating JavaScript Projects to TypeScript

There are five steps to migrate a JavaScript project to TypeScript.
After each step, run `npm run compile` and fix any reported errors.

1. Add the use of tsc.

   - In the top project directory, enter `npm install -D typescript`.

   - Add the following to the `compilerOptions` in `tsconfig.json`:  
     `"allowJs": true,`  
     `"outDir": "dist"`,  
     `"target": "ES5"`  
     Generated files will be written to the `dist` directory.

   - Add the following `include` option in `tsconfig.json`:  
     `"include": ["src"]`

   - Add the following npm script in `package.json`:  
     `"compile": "tsc"`

2. Enable type checking of `.js` files.

   - Add the following to the `compilerOptions` in `tsconfig.json`:  
     `"checkJs": true`

   - Optionally add `// @ts-nocheck` at the top of `.js` files
     with too many errors to fix now.

   - Optionally temporarily add `"noImplicitAny": false`
     to the `compilerOptions` in `tsconfig.json`
     because `any` will be a commonly inferred type.

     TypeScript type checking is more lenient on `.js` files.
     Function parameters are optional.
     Class property types are inferred based on usage.
     Extra properties can be assigned to objects.

3. Optionally add JSDoc comments  
   These appear before functions to provide parameter and return types.
   Supported JSDoc annotations are listed at
   <https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc>.
   For example:

   ```js
   /**
    * description
    * @param name {type} description
    * @return {type} description
    */
   ```

4. Rename `.js` files to `.ts`  
   Consider doing this one file at a time, renaming, compiling, and fixing errors.

5. Stop processing `.js` files and make type checking strict  
   Add/change the following `compilerOptions` in `tsconfig.json`:  
   `"allowJs": false,`  
   `"checkJs": false,`  
   `"strict": true`

## Processing Details

When a `.ts` file imports a `.js` file,
it looks for a corresponding `.d.ts` file
in the same directory as the `.js` file.
If no such file is found and `allowJs` and `checkJs` are true, types are inferred.
If no such file is found and `allowJs` and `checkJs` are false, types are treated as `any`.

When a `.ts` file imports from an npm package
(stored locally under `node_modules`)
it looks for type definitions in `src/types.ts`.
You can manually create type definitions here.

If `src/types.js` is not found, it looks for the
`types` or `typings` key in `package.json`
of the npm package that points to a `.d.ts` file.

If this is not found, it looks for a `.d.ts` file
in `node_modules/@types/package-name`
working upward to the top `node_modules` directory of the app.
This supports nested dependencies.

If this is not found, it uses the lookup process
for local (non-npm) imports.

You can override where TypeScript looks for type declarations
by setting the `typeRoots` option
in the `compilerOptions` in `tsconfig.json`,
but doing this is not common.

## Whitelisting

When an npm package doesn’t include type definitions
and they aren’t available in DefinitelyTyped,
there are three options;

1. Define the types yourself, perhaps in `src/types.ts`.  
   Consider contributing your type definitions to the package or DefinitelyTyped.
2. Whitelist specific imports by preceding them with `// @ts-ignore`.
3. Whitelist all usages of the package by adding a line in `src/types.ts`.
   For example, `declare module 'package-name';`

## Polyfills

`tsc` transpiles to many target environments,
but it doesn’t provide any polyfills
for functionality not present in the target environment.

Popular polyfill libraries include
`core-js`, `@babel/polyfill`, and `polyfill.io`.

Babel can be used to get support for language features
that TypeScript doesn’t yet support.

Set the `lib` option in the `compilerOptions` in `tsconfig.json`
to indicate which features have been polyfilled.

## TypeScript With Node.js

When using TypeScript with Node.js, the following
`tsconfig.json` is recommended as a starting point:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "module": "commonjs",
    "noImplicitReturns": true,
    "outDir": "dist",
    "sourceMap": true,
    "strict": true,
    "target": "es2015",
 }
  "include": ["src"]
}
```

Setting `module` to `commonjs`
compiles `import` statements to `require` calls and
`export` statements to `module.exports` assignments.

## TypeScript With React

To use TypeScript in React projects,
configure the use of `tsc` as an npm script in `package.json`.
This is done for you if create-react-app is used as follows
to create the React project:

```bash
create-react-app my-app --typescript
```

React component props and state are defined differently when using TypeScript.

Here is an example of a function component that takes props:

```ts
import React from 'react';

type Props = {
  name: type,
  ...
};

function ComponentName(props: Props) {
  ...
}

export default ComponentName;
```

Here is an example of a class component
that takes props and uses state:

```ts
import React, {Component} from 'react';

type Props = {
  name: type,
  ...
};

type State = {
  name: type,
  ...
};

class ComponentName
extends Component<Props, State> {
  state = {
    name: type,
    ...
  };

  render() {
    ...
  }
}

export default ComponentName;
```

Use React’s synthetic event types instead of DOM event types.
Type definitions for these can be found at
<https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts>.
They include `ChangeEvent`, `FocusEvent`, `KeyboardEvent`,
`MouseEvent`, `TouchEvent`, `WheelEvent`, and more.

When using the `useState` hook,
if TypeScript can’t infer the type from the initial value,
specify it like this:

```ts
const [name, setName] = useState<type>(initialValue);
```

## Features Coming in TypeScript 3.7

There are many new features coming in TypeScript 3.7.
These include optional chaining, null coalescing, and top-level `await`.

Here is an example of optional chaining:

```ts
// Old way
const zip = person && person.address ? person.address.zip : undefined;

// New way
const zip = person?.address?.zip;
```

Here is an example of null coalescing:

```ts
// Old way - chooses option2 if option1 is any falsy value
// including undefined, null, false, zero, or empty string
const option = option1 || option2;

// New way - chooses option2 only if option1 is undefined or null
const option = option1 ?? option2;
```

Top-level await allows the use of the `await` keyword to
wait for a `Promise` to resolve at the top level of code,
not just inside `async` functions.

## `private` vs. `#` Prefix Fields

"Public and private instance fields" is a TC39 proposal
that is currently at stage 3.
This defines a way to mark instance properties of a class
as private by prefixing their name with a `#` character.

TypeScript does not yet support this, but work to do so is underway.
See <https://github.com/microsoft/TypeScript/pull/30829>.

There are some differences between the meaning of
the `private` keyword and the `#` field name prefix.

- When are they evaluated?  
  Private fields are evaluated only at compile time
  and do not generate code to protect accesses.  
  `#` prefix fields generate code to protect access at runtime.
- What happens when a subclass and superclass define a field with the same name?  
  Duplicate private fields represent the same value.
  `#` prefix fields represent different values.
- Are they visible in `console.log` and `JSON.stringify` output?  
  `private` fields are visible, but `#` prefix fields are not.

## Do's and Don'ts

The page at <https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html>
provides recommendations on things you should and should not do in TypeScript.

One of the recommendations is to never use the wrapper types
`Boolean`, `Number`, `String`, `Symbol`, and `Object`.

See this site for additional recommendations.

## Things to Avoid

TypeScript has a large number of features.
While all of them have some justification, many are rarely used.
This increases the likelihood that many developers
will not be familiar with them.
To reduce the learning curve of TypeScript for your team
and improve code readability,
I recommend avoiding the use of the following TypeScript features.

- Tuples with a minimum length and no maximum using the spread operator  
  For example:  
  `type badIdea = [number, number, ...number[]] // contains 2 or more numbers`
- Implementing functions that use `this`  
  ... and declaring the type of this as the first parameter
  rather than implementing it as a method of a class
- Overloaded functions
- Bounded polymorphism with multiple constraints
- Generic type defaults
- Using `this` as a return type of a method in a superclass
- Intersection types  
  These match only what multiple types have in common.
  It's hard to think of a good example of when this would be useful.
- Interfaces extending a type alias or class
- Comparing classes
- Defining a constructor signature in an `interface` with `new`
- Decorators  
  These are currently an experimental feature.
- `private` constructors to simulate final classes  
  Such classes cannot be extended or directly instantiated
  (must use static factory methods).
- `as const` assertions
- Type assertions
- Tagged Unions
- Keying-in operation  
  This extracts a shape type from another type.
- `keyof` operator  
  This gets property names from a shape.
- Mapped types, including built-in ones
- Companion object pattern
- Creating tuples with a function  
  ... instead of using the `[]` syntax.
- User-defined type guards
- Conditional types, including built-in ones
- Distributive conditionals
- `infer` keyword
- Non-null assertions  
  These just assert that a value is not null.
- Definite assignment assertions
- Type branding
- Extending prototypes
- Dynamic imports
- TypeScript namespaces
- Declaration merging
- Project references
- Triple-slash directives
- `amd-module` directive
- Utility types other than `Record` and `Readonly`

## Conclusion

TypeScript is a large language with a wonderful core set of features.
By limiting yourself to the most important set of features,
you will write code that derives most of the benefits of TypeScript
while keeping the code as readable as possible.

Thanks so much to Charles Sharp and Jason Schindler for reviewing this article!

## References

Cherny, Boris. Programming TypeScript. USA: O'Reilly, 2019
