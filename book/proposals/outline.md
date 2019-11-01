# Svelte & Sapper Up and Running

THIS IS OUTDATED!
SEE https://docs.google.com/document/d/1hDrRKY13nX9Z4mLrFxVLA2QzeXfVEWM5c6g10cvIbtM/edit?ts=5d94e615#

- Top-level bullets are sections
- 2nd-level bullets are chapters

- Introduction

  - Svelte Overview
    - What is Svelte?
      - web application compiler
        - can add an unlimited number of features
          without affecting bundle sizes because
          the compiler only includes what is used
      - no virtual DOM like React and Vue
      - developed by Rich Harris
      - small bundle sizes
      - CSS scoped by default
      - clear place for global CSS
      - easy component state management - reactivity
      - reactive statements (destiny operator)
      - easy app state management (stores)
      - easy way to pass data to descendant components (context)
      - two-way data binding
      - easy animations built-in
      - runtime warnings for accessibility issues
    - Why consider Svelte?
      - write less code
      - code is easier to understand
      - all the features in previous section
    - Does Svelte disappear?
      - discuss amount of Svelte library code included in bundles

  - Sapper Overview
    - What is Sapper?
      - pages are components
      - easy routing based on directory and file names
      - code splitting
      - offline support through Service Workers
      - server-side rendering (SSR) (similar to Next.js for React)
      - static site generate (similar to Gatsby for React)
      - server routes for implementing server APIs (REST services)
      - prefetching so components render faster
    - Why consider Sapper?

- Svelte
  - Getting Started With Svelte
    - npx
    - REPL download
  - Defining Components
    - in .svelte files with \<script>, \<style>, and HTML sections
  - Component Names
  - Component Props
  - Styling
    - component-based and global
    - Can Svelte identify unused CSS without Prettier?
  - Importing Components
  - Inserting HTML from strings
  - Reactivity
    - Are top-level variables only treated as state (watched)
      if there are used in the template HTML?
  - Reactive Statements
    - a.k.a. destiny operator
    - reactive declarations
  - Logic in Markup
    - If Markup
    - Each Markup
    - Await Markup
  - Slots
    - default and named
  - Binding Form Elements
    - to Variables
    - to custom props
  - Event Handling
    - DOM events
    - dispatching custom events
  - Lifecycle Functions
    - `onMount`
    - `beforeUpdate`
    - `afterUpdate`
    - `onDestroy`
  - Actions
    - call a function when an element is added to DOM
  - Sharing Data
    - Props
    - Context
    - Stores
      - readable, writable, derived, and custom
  - Module Context
  - Batched DOM Updates
  - Animation
    - show clock SVG example? <https://svelte.dev/repl/clock?version=3.12.1>
    - show your spinner example?
  - Special Elements
  - Debugging
  - Compiling to Custom Elements

- Sapper
  - Getting Started With Sapper
    - npx
  - Provided Files
    - package.json
    - client.js
    - server.js
    - service-worker.js
    - template.html
    - static directory
    - bundler configuration
  - Routes
  - Server Routes
    - for implementing server APIs (REST services)
  - Error Page
  - Client API
    - start app with `start()`
    - programmatically navigate with `goto()`
    - Pre-fetching
      - fetching data ahead of component rendering
      - methods `this.fetch`, `this.error`, and `this.redirect`
  - Layouts
  - Server-side Rendering
  - Sapper Stores
  - building dynamic apps for deployment
  - exporting static apps for deployment

- Tooling for Svelte and Sapper
  - ESLint
  - Prettier
  - VS Code and the Svelte Extension
  - Unit Tests
    - Jest and svelte-testing-library
  - End-to-End Tests
    - Cypress
  - Storybook

- Resources
  - Svelte Resources
  - Sapper Resources
