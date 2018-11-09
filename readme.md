# Webpack starter tutorial

## Table of Contents

- [References](#references)
- [Notes](#notes)
  - [Getting started](#getting-started)`
  - [webpack-dev-server](docs/webpack-dev-server.md)
  - [Composing config](docs/composing-config.md)
  - [Loaders and Styling](docs/loaders-styling.md)
  - [Separating CSS](docs/separating-css.md)

## References:

- [Webpack Configuration Docs](https://webpack.js.org/configuration/)
- [Surviving JS](https://survivejs.com/webpack/developing/getting-started/)
- [Webpack Docs](https://webpack.js.org/guides/getting-started/)
- [Webpack npm page](https://www.npmjs.com/package/webpack)

## Articles

- [article 1](https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1)
- [article 2](https://medium.freecodecamp.org/how-to-combine-webpack-4-and-babel-7-to-create-a-fantastic-react-app-845797e036ff)
- [article 3](https://wanago.io/2018/07/16/webpack-4-course-part-two-webpack-4-course-part-two-loaders/)

## Notes

### Getting started

[Reference used](https://survivejs.com/webpack/developing/getting-started/)

#### What is Webpack

Let's start with easy stuff, what is Webpack?

- First, Webpack is a module bundler, that lets you bundle modules together into one bigger file
  - this comes in handy when you're using a bunch of different libraries that you need to combine together at some point
- In addition, Webpack was built to be highly modular
  - there is a very large echosystem of plugins and loaders that extend the functionality of webpack
  - the biggest downside is twofold
    a.) you need to be *VERY CONSCIOUS* of how you configure Webpack
    b.) the learning curve is very steep

#### Setting up Webpack

To install webpack use:
```powershell
npm i -D webpack webpack-cli
```
- `webpack-cli` comes with additional functionality including `init` and `migrate` commands that allow you to create new webpack configuration fast and update from an older version to a newer one.

#### Setting up assets

So if you check the `src` folder you'll see that we've started a small app. However, we're unable to currently test the application in the browser since there's no  HTML file that points to the bundled files.

This is where `html-webpack-plugin` comes in.

- `html-webpack-plugin` can be installed via: `npm i html-webpack-plugin -D`
- To hook up HWP use the following:
  ```js
  const HtmlWebpackPlugin = require("html-webpack-plugin"); // import the plugin

  module.exports = {
    //...
    plugins: [ // array with a list of plugins you want to use
      new HtmlWebpackPlugin({ // initiate an instance of HWP
        title: "Webpack demo", // adds the title field to the index.html file that's to be generated
      }),
    ],
  };
  ```
- Once you configure it, you can use `npm run build` to bundle everything up and check out the generated index.html file
- In addition you can start a server using `serve` or `webpack-dev-server`

#### Webpack output

- When we use `node_modules/.bin/webpack --mode production` we get the following back:
  ```PowerShell
  Hash: aafe36ba210b0fbb7073
  Version: webpack 4.1.1
  Time: 338ms
  Built at: 3/16/2018 3:40:14 PM
      Asset       Size  Chunks             Chunk Names
    main.js  679 bytes       0  [emitted]  main
  index.html  181 bytes          [emitted]
  Entrypoint main = main.js
    [0] ./src/index.js + 1 modules 219 bytes {0} [built]
        | ./src/index.js 77 bytes [built]
        | ./src/component.js 142 bytes [built]
  Child html-webpack-plugin for "index.html":
      1 asset
      Entrypoint undefined = index.html
        [0] (webpack)/buildin/module.js 519 bytes {0} [built]
        [1] (webpack)/buildin/global.js 509 bytes {0} [built]
          + 2 hidden modules
  ```
- The output tells use the following:
  - `Hash: aafe36ba210b0fbb7073` - The hash of the build, we can use this to invalidate assets via the `[hash]` placeholder.
  - Webpack version, time taken, as well as when the build was initiated
  - The below table which shows the assets built
  ```PowerShell
      Asset       Size  Chunks             Chunk Names
    main.js  679 bytes       0  [emitted]  main
  index.html  181 bytes          [emitted]
  ```
    - within that table, the row tells use the name of the file emitted and the size of the file
  - `Entrypoint main = main.js` is where Webpack starts to build the dependency graph
  ```PowerShell
    [0] ./src/index.js + 1 modules 219 bytes {0} [built]
        | ./src/index.js 77 bytes [built]
        | ./src/component.js 142 bytes [built]
  ```
  - The above is the dependency tree for the JavaScript file
    - the first line lists the path of `index.js` and following it are the number of dependent modules it uses, its total size in bytes, `{0}`, and build status
      - this line represents the master JavaScript file
    - below it is the files that `index.js` depends on, its size, and build status
  - `Child html-webpack-plugin for "index.html"`  This is plugin-related output.
    - in this case `html-webpack-plugin` is creating this output on its own.

- In addition to a configuration object, webpack accepts an array of configurations. You can also return a Promise and eventually resolve to a configuration for example
- So typing out `./node_modules/.bin/webpack` is no fun so we can use npm scripts to add a shortcut
  - within `package.json` add:
  ```JSON
  {
    "...more above",
    "scripts": {
    "build": "webpack --mode production"
  }
  }
  ```
  - lets us use `npm run build` instead since npm automatically adds `./node_modules/.bin/` in
- Note that you can technically replace `htmlwebpackplugin` with your own, but there are premade ones like `html-webpack-template` or `html-webpack-template-pug`
  - [favicons-webpack-plugin](https://www.npmjs.com/package/favicons-webpack-plugin) is able to generate favicons.
  - [script-ext-html-webpack-plugin](https://www.npmjs.com/package/script-ext-html-webpack-plugin) gives you more control over script tags and allows you to tune script loading further.
  - [style-ext-html-webpack-plugin](https://www.npmjs.com/package/style-ext-html-webpack-plugin) converts CSS references to inlined CSS. The technique can be used to serve critical CSS to the client fast as a part of the initial payload
  - [resource-hints-webpack-plugin](https://www.npmjs.com/package/resource-hints-webpack-plugin) adds resource hints to your HTML files to speed up loading time.
  - [preload-webpack-plugin](https://www.npmjs.com/package/preload-webpack-plugin) enables rel=preload capabilities for scripts and helps with lazy loading, and it combines well with techniques discussed in the Building part of this book.
  - [webpack-cdn-plugin](https://www.npmjs.com/package/webpack-cdn-plugin) allows you to specify which dependencies to load through a Content Delivery Network (CDN). This common technique is used for speeding up loading of popular libraries.
  - [dynamic-cdn-webpack-plugin](https://www.npmjs.com/package/dynamic-cdn-webpack-plugin) achieves a similar result.

[Back to top](#table-of-contents)