# Webpack starter tutorial

## Table of Contents

- [References](#references)
- [Notes](#notes)
  - [Getting started](#getting-started)
  - [webpack-dev-server](#webpack-dev-server)
    - [WDS integration](##wds-integration)
    - [Additional Functionality](##additional-functionality)
  - [Composing config](#composing-configuration)

## References:

- [Webpack Configuration Docs](https://webpack.js.org/configuration/)
- [Surviving JS](https://survivejs.com/webpack/developing/getting-started/)
- [Webpack Docs](https://webpack.js.org/guides/getting-started/)
- [Webpack npm page](https://www.npmjs.com/package/webpack)

## Notes

### Getting started

[Reference used](https://survivejs.com/webpack/developing/getting-started/)

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

### webpack-dev-server

[Reference used](https://survivejs.com/webpack/developing/webpack-dev-server/)

#### Webpack watch and WDS

- There's multiple different tools that allow you to have live updating pages while you're developing (VSCode's Live Server extension, npm browser-sync, etc)
- Browsersync in particular can actually hook up to Webpack, which is quite nice, but before we go there, Webpack has several tricks.
- The first is to run webpack in watch mode
  ```
  npm run build --watch
  ```
  - Once enabled, watch mode detects changes and recompiles automatically
    - `webpack-dev-server`(WDS) takes the watch mode implementation even further
    - **NOTE THAT WEBPACK-DEV-SERVER IS MEANT TO BE DEVELOPMENT ONLY, NOT HOSTING**
- WDS is a development server that runs in-memory
  - it means that bundle files are written in memory rather than actual physical files
  - there are methods to emit files to the file system
  - if you're integrating with another server that expects to find the files, `write-file-webpack-plugin` lets you do this
- By default, WDS refreshes content automatically in the browser while you develop, but it also supports Hot Module Replacement
- HMR allows you to patch the browser state without fully refreshing the page (makes it great to use while developing with React where updates mess with the application state)
- WDS gives you an interface to patch your code on the fly, but faces efficiency issues if you don't implement this for the client side code
  - CSS is trivial since it has no state, but JavaScript and related frameworks/ libraries are a problem

#### WDS Integration

- To get started with WDS, you have to install it!!!
  ```
  npm install webpack-dev-server --save-dev
  ```
- Then integrating it into your *package.json* file using convention:
  ```JSON
  {
    "...more above",
    "scripts":{
      "start": "webpack-dev-server --mode development",
      "build": "webpack --mode production"
    }
  }
  ```
- You should get the below output
  ```PowerShell
  i ｢wds｣: Project is running at http://localhost:8080/
  i ｢wds｣: webpack output is served from /
  i ｢wdm｣: Hash: f8bf3d96fd5afd834f79
  Version: webpack 4.25.1
  Time: 778ms
  Built at: 11/05/2018 8:09:45 PM
      Asset       Size  Chunks             Chunk Names
    index.html  181 bytes          [emitted]
    main.js    343 KiB    main  [emitted]  main
  ```
WDS tries to run in another port in case the default one is being used. The terminal output tells you where it ends up running. You can debug the situation with a command like netstat -na | grep 8080. If something is running on the port 8080, it should display a message on Unix.

In addition to production and development, there's a third mode, none, which disables everything and is close to the behavior you had in versions before webpack 4.

#### WDS configuration

- WDS functionality can be customized through the devServer field in the webpack configuration
  - you can set most of these options through the CLI as well, but managing them through webpack is fairly straightforwards
  ```JS
  ...

  module.exports = {

    devServer: {
      // Display only errors to reduce the amount of output.
      stats: "errors-only",

      // Parse host and port from env to allow customization.
      //
      // If you use Docker, Vagrant or Cloud9, set
      // host: options.host || "0.0.0.0";
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: process.env.HOST, // Defaults to `localhost`
      port: process.env.PORT, // Defaults to 8080
      open: true, // Open the page in browser
    },

    ...
  };
  ```

- After this change, you can configure the server host and port options through environment parameters
  - example: `PORT=3000 npm start` (this is for Node???)
  - `dotenv` allows you to define environment variables through a `.env` file.
  - `dotenv` allows you to control the host and port setting of the setup quickly.
  - enable devServer.historyApiFallback if you are using HTML5 History API based routing.
- WDS also allows for an overlay for capturing compilation related warnings and errors
  - set via the below `devServer` option:
  ```js
  module.exports = {
  devServer: {
    ...

    overlay: true,

  },
  ...
  };
  ```
- If you want even better output, consider `error-overlay-webpack-plugin` as it shows the origin of the error better.
  - **NOTE: WDS overlay does not capture runtime errors of the application.**

#### Accessing the dev server from network

- It's possible to customize host and port settings through the environment in the setup (i.e., export PORT=3000 on Unix or SET PORT=3000 on Windows)
- The default settings are enough on most platforms.
- To access your server, you need to figure out the ip of your machine
  - on Unix, this can be achieved using `ifconfig | grep inet`
  - on Windows, `ipconfig` can be utilized
  - an npm package, such as `node-ip` come in handy as well. Especially on Windows, you need to set your HOST to match your ip to make it accessible.

#### Speedier development configuration

- WDS handles server updates when it detects updates in a bundled file, but it doesn't actually detect when the webpack config file is updated
- This can be automated using `nodemon`
  - `npm install nodemon --save-dev`
- Below is the package.json to enable it

  ```JSON
  {
    "...more above",
    "scripts": {
    "start": "nodemon --watch webpack.config.js --exec \"webpack-dev-server --mode development\"", // this is the new one
    "build": "webpack --mode production"
  },
  }
  ```
#### Polling
- Sometimes the file watching setup provided by WDS won't work on your system
  - e.g on older versions of Windows, Ubuntu, Vagrant, and Docker
- **NOTE THAT THIS IS MORE RESOURCE INTENSIVE**
- To enable polling, use the below:
```JS
  const path = require("path");
  const webpack = require("webpack");

  module.exports = {
    devServer: {
      watchOptions: {
        // Delay the rebuild after the first change
        aggregateTimeout: 300,

        // Poll using interval (in ms, accepts boolean too)
        poll: 1000,
      },
    },
    plugins: [
      // Ignore node_modules so CPU usage with poll
      // watching drops significantly.
      new webpack.WatchIgnorePlugin([
        path.join(__dirname, "node_modules")
      ]),
    ],
  };
```

#### Additional functionality

- WDS also provides several other config options that may be helpful
- `devServer.contentBase`
  - if you don't want to generate `index.html` and want to keep it in a specific directory, you'll need to point WDS to it
  - the `contentBase` option accepts a path (e.g., "build") or an array of paths (e.g., ["build", "images"])
  - the default value is the project root
- `devServer.proxy`
  - if you are using multiple servers, you'll need to proxy WDS to them
  - the setting accepts an object of proxy mappings that resolves matching queries to another server
  - it's formatted like the below:
  ```json
  {
     "/api": "http://localhost:3000/api"
  }
  ```
  - disabled by default
- `devServer.headers` - Attach custom headers to your requests here.

- More options can be found in the [official documentation](https://webpack.js.org/configuration/dev-server/)

#### Development plugins

**NOTE THAT THIS SECTION AND THE BELOW SECTION AREN'T NECESSARILY REQUIRED. IT DEPENDS ON YOUR PROJECT AND SHOULD BE SELECTED DEPENDING ON WHAT YOU NEED**

The webpack plugin ecosystem is diverse, and there are a lot of plugins that can help specifically with development

- `case-sensitive-paths-webpack-plugin` can be handy when you are developing on case-insensitive environments like macOS or Windows but using case-sensitive environment like Linux for production
- `npm-install-webpack-plugin` allows webpack to install and wire the installed packages with your package.json as you import new packages to your project.
- `react-dev-utils` contains webpack utilities developed for Create React App
  - Despite its name, they can find use beyond React. If you want only webpack message formatting, consider `webpack-format-messages`.
- `start-server-webpack-plugin` is able to start your server after webpack build completes.

#### Output plugins

There are also plugins that make the webpack output easier to notice and understand:

- `system-bell-webpack-plugin` rings the system bell on failure instead of letting webpack fail silently.
- `webpack-notifier` uses system notifications to let you know of webpack status.
- `nyan-progress-webpack-plugin` can be used to get tidier output during the build process
  - Take care if you are using Continuous Integration (CI) systems like Travis as they can clobber the output
  - Webpack provides `ProgressPlugin` for the same purpose. No nyan there, though.
- `friendly-errors-webpack-plugin` improves on error reporting of webpack. It captures common errors and displays them in a friendlier manner.
- `webpack-dashboard` gives an entire terminal based dashboard over the standard webpack output. If you prefer clear visual output, this one comes in handy.


[Back to top](#table-of-contents)

### Composing Configuration

[Reference used](https://survivejs.com/webpack/developing/composing-configuration/)

So as a review, we can do a pretty decent amount of stuff now. But at some point we'll need to figure out how to compose our config since we'll have different ones for both development and production. A single config isn't recommended since it makes readability difficult.

- Here's our options:
  - maintain configuration within multiple files for each environment and point webpack to each through the `--config` parameter, sharing configuration through module imports.
  - push configuration to a library, which you then consume
    - Examples: hjs-webpack, Neutrino, webpack-blocks.
  - push configuration to a tool. Examples: create-react-app, kyt, nwb.
  - maintain all configuration within a single file and branch there and rely on the `--env` parameter. The approach is explained in detail later in this chapter.

#### Config by merge

- If we're breaking our config into separate pieces, they'll need to be combined again
- This means using `Object.assign` and `Array.concat` by default, which isn't great
- To bypass this, `webpack-merge` was developed
- Webpack-merge does two things:
  1. concatenates arrays
  2. merges objects
  - in addition webpack-merge does this in a way that avoids overriding them so that composition is allowed like in the below example:
  ```js
  > merge = require("webpack-merge")
  ...
  > merge(
  ... { a: [1], b: 5, c: 20 },
  ... { a: [2], b: 10, d: 421 }
  ... )
  { a: [ 1, 2 ], b: 10, c: 20, d: 421 }
  ```
- Beyond that, `webpack-merge` allows for finer control via strategies that allow you to control its behavior per field
  - i.e append, prepend, or replace content
  - there's also [webpack-chain](https://www.npmjs.com/package/webpack-chain) which provides a fluent API for configuring webpack allowing you to avoid configuration shape-related problems while enabling composition.
    - `webpack-merge` was made for the purposes of this book, and technically should be replaced with `webpack-chain` at some point

#### Webpack merge setup

[webpack-merge docs]()

To start, add `webpack-merge` to your `package.json`
  ```
  npm i -D webpack-merge
  ```
- With that we can define *webpack.config.js* for higher level configuration and *webpack.parts.js* for configuration parts to consume
- So we'll make **webpack.parts.js** with the below contents
  ```js
  exports.devServer = ({ host, port } = {}) => ({
    devServer: {
      stats: "errors-only",
      host, // Defaults to `localhost`
      port, // Defaults to 8080
      open: true,
      overlay: true,
    },
  });
  ```
  - Also note the *stats* idea also works for production as well. More in the [documentation](https://webpack.js.org/configuration/stats/)
- We can then use merge to import this config into *webpack.config.js* like in the below:
  ```js
  const merge = require("webpack-merge"); // imported webpack plugin
  const HtmlWebpackPlugin = require("html-webpack-plugin"); // imported webpack plugin

  const parts = require("./webpack.parts"); // imported CUSTOM config

  const commonConfig = merge([
    {
      plugins: [
        new HtmlWebpackPlugin({
          title: "Webpack demo",
        }),
      ],
    },
  ]);

  const productionConfig = merge([]);

  const developmentConfig = merge([
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT,
    }),
  ]);

  module.exports = mode => {
    if (mode === "production") {
      return merge(commonConfig, productionConfig, { mode });
    }

    return merge(commonConfig, developmentConfig, { mode });
  };
  ```
- This composition doesn't actually return a direct config. Instead it returns the passed `env`
- From the passed `env`, a configuration is returned and in addition, it maps webpack `mode` to it.
  - see the [webpack docs page](https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations) on it
- As a result, we need to update our current `package.json` with the below:
```json
{
  "...more above",
  "scripts": {

  "start": "webpack-dev-server --env development",
  "build": "webpack --env production"

},
}
```
- Once you run the above scripts, it should behave the same ways as before
- The difference being that we have plenty of ways to expand functionality
- In addition we can add more targets by expanding the `package.json` definition and branching at `webpack.config.js` as needed.
  - and subsequently `webpack.parts.js` grows to contain whatever specific techniques/ modules you need to compose the config
  - the `process` module used in the code is exposed by *Node* as a global
    - In addition to `env`, it provides plenty of other functionality that allows you to get more information of the host system.

#### Understanding env

- Even though --env allows to pass strings to the configuration, it can do a bit more. Consider the following `package.json` script:
```json
{
  "...more above",
  "scripts": {
  "start": "webpack-dev-server --env development",
  "build": "webpack --env.target production"
},
}
```
- Instead of a string, you should receive an object `{ target: "production" }` at configuration now
- You could pass more key-value pairs, and they would go to the env object.
  - If you set `--env foo` while setting `--env.target`, the string wins
  - Webpack relies on yargs for parsing underneath.



[Back to top](#table-of-contents)