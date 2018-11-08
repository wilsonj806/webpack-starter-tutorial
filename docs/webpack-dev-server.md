# webpack-dev-server

[Reference used](https://survivejs.com/webpack/developing/webpack-dev-server/)

## Webpack watch and WDS

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

## WDS Integration

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

## WDS configuration

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

## Accessing the dev server from network

- It's possible to customize host and port settings through the environment in the setup (i.e., export PORT=3000 on Unix or SET PORT=3000 on Windows)
- The default settings are enough on most platforms.
- To access your server, you need to figure out the ip of your machine
  - on Unix, this can be achieved using `ifconfig | grep inet`
  - on Windows, `ipconfig` can be utilized
  - an npm package, such as `node-ip` come in handy as well. Especially on Windows, you need to set your HOST to match your ip to make it accessible.

## Speedier development configuration

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
## Polling
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

## Additional functionality

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

## Development plugins

**NOTE THAT THIS SECTION AND THE BELOW SECTION AREN'T NECESSARILY REQUIRED. IT DEPENDS ON YOUR PROJECT AND SHOULD BE SELECTED DEPENDING ON WHAT YOU NEED**

The webpack plugin ecosystem is diverse, and there are a lot of plugins that can help specifically with development

- `case-sensitive-paths-webpack-plugin` can be handy when you are developing on case-insensitive environments like macOS or Windows but using case-sensitive environment like Linux for production
- `npm-install-webpack-plugin` allows webpack to install and wire the installed packages with your package.json as you import new packages to your project.
- `react-dev-utils` contains webpack utilities developed for Create React App
  - Despite its name, they can find use beyond React. If you want only webpack message formatting, consider `webpack-format-messages`.
- `start-server-webpack-plugin` is able to start your server after webpack build completes.

## Output plugins

There are also plugins that make the webpack output easier to notice and understand:

- `system-bell-webpack-plugin` rings the system bell on failure instead of letting webpack fail silently.
- `webpack-notifier` uses system notifications to let you know of webpack status.
- `nyan-progress-webpack-plugin` can be used to get tidier output during the build process
  - Take care if you are using Continuous Integration (CI) systems like Travis as they can clobber the output
  - Webpack provides `ProgressPlugin` for the same purpose. No nyan there, though.
- `friendly-errors-webpack-plugin` improves on error reporting of webpack. It captures common errors and displays them in a friendlier manner.
- `webpack-dashboard` gives an entire terminal based dashboard over the standard webpack output. If you prefer clear visual output, this one comes in handy.


[Back to main](../readme.md)