Title: React
Date: 2021-02-07
Category: Notes

React can be installed with `npm i -g create-react-app`.
React app is created with `create-react-app <name>`.  
The React app is installed in the `<name>` directory.  
By default `create-react-app` installs and uses `yarn` to install stuff.

```
[mpm@winebox Zaras]$ create-react-app zaras
[mpm@winebox Zaras]$ tree . -L 2
-- zaras
    |-- README.md
    |-- node_modules
    |-- package.json
    |-- public
    |-- src/
        |-- App.css
        |-- App.js
        |-- App.test.js
        |-- index.css
        |-- index.js
        |-- logo.svg
        |-- serviceWorker.js
        `-- setupTests.js
    `-- yarn.lock
[mpm@winebox zaras]$ tree src/
src/
|-- App.css
|-- App.js
|-- App.test.js
|-- index.css
|-- index.js
|-- logo.svg
|-- serviceWorker.js
`-- setupTests.js
```

`App.js` can be considered the main focal point of a React app.  
It defines a function called `App` that returns HTML.

You can create a react component. An object. For example a function that returns a react object.

Here's an example:

```
 function Article() {  
     return (  
         <div>  
             <h1>{ article.title }</h1>  
             <section>{ article body }</section>  
         </div>  
     )  
 }
```
In this case it's inferring the type to be a react component.

"A good practice is to have only one file for each component "

# COMPONENTS

A component is basically HTML and JavaScript mixed in a React-custom way.

Here's how to create and use a component without having to know any syntax.

You need an object. Whether it's a function that returns an object or a class that extends component, it doesn't matter.

If it's a function you can pass the properties from the HTML as a parameter. Classes can use constructors.

A component can be instanced using its class or function name. Class components can have state.

# Elements

An element is a fundamental building block in React. Elements and components cannot be ordinarily changed; they must be re-rendered with ReactDom.render().

The difference between an element and a component is that components can take parameters and they return an element.

The entry point for react is an HTML tag with the id "root". You can have multiple roots (with different IDs), but conventionally there is only one.

# JSX

JSX is compiled with Babel to produce JS. It lets you seamlessly use HTML tags in your code.

# Properties

With components, you can take in properties. I'll let this quote from the official docs explain it:

'When React sees an element representing a user-defined component, it passes JSX attributes and children to this component as a single object. We call this object “props”.'

With a code sample:

![qownnotes-media-ircVQw](media/qownnotes-media-ircVQw-722.png)


For example, a function can take an argument which we'll call props, and you can then use that parameter in the function. Basic stuff.

The nuance is that if a function returns an Element then it is a component, but can only be used as one if it has a maximum of *one* parameter. This is the blueprint of a **function component**.

# Components

*Note: Always start component names with a capital letter.*

You can also define a component as an ES6 class.

You must inherit (`extend`) from React.Component and it must have a `render` method which returns an element.

As mentioned earlier, elements and components are generally immutable, but **stateful components** aren't.

# Redux

You define your actions. These are usually functions. They return an object with a `type` member specifying the user-defined name of the action. This is a string. It is good practice to define a constant with this string to avoid typos.

A store requires a reducer function. The reducers job is to take in an action object and return a new state reflecting the requested change in state. It is a pure function. No state is modified. The function takes in the current state and an action in case you want the new state to be based on the old state.

To actually create the store you need to call `const store = Redux.createStore(reducer, Redux.applyMiddleware(ReduxThunk.default))`. Obviously this specific invocation creates an asynchronous store.

After this you can dispatch actions to the store. This looks like the following:

`store.dispatch(action(args));`.

Asynchronous actions require a bit more work.

For each asynchronous "action" you should create two actions. One for the start, one for the finish. The key difference is that the function used to dispatch should not return an object. It should return a function which takes a "dispatch" function. You dispatch from within this function.

# Resources    

- https://blog.soshace.com/react-lessons-lesson-1-introduction/

- https://reactjs.org/docs/components-and-props.html
