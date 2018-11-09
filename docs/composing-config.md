# Composing Configuration

## Reference

[Survive JS](https://survivejs.com/webpack/developing/composing-configuration/)

## Intro

So as a review, we can do a pretty decent amount of stuff now. But at some point we'll need to figure out how to compose our config since we'll have different ones for both development and production. A single config isn't recommended since it makes readability difficult.

- Here's our options:
  - maintain configuration within multiple files for each environment and point webpack to each through the `--config` parameter, sharing configuration through module imports.
  - push configuration to a library, which you then consume
    - Examples: hjs-webpack, Neutrino, webpack-blocks.
  - push configuration to a tool. Examples: create-react-app, kyt, nwb.
  - maintain all configuration within a single file and branch there and rely on the `--env` parameter. The approach is explained in detail later in this chapter.

## Config by merge

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

## Webpack merge setup

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

## Understanding env

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

## Config Layouts

- In this project we push our config into the below files:
  - webpack.config.js
  - webpack.parts.js
- `webpack.config.js` is the high level configuration while `webpack.parts` is the lower level that isolates you from webpack specifics(i.e it should have mostly just settings and stuff)
- We can actually go further now that we know how to compose our config. See below for an example of separate configs for production and development:
```
.
└── config
    ├── webpack.common.js
    ├── webpack.development.js
    ├── webpack.parts.js
    └── webpack.production.js
```
- In this case, you would point to the targets through `webpack --config` parameter and merge common configuration through `module.exports = merge(common, config)`

- To add hierarchy to the way configuration parts are managed, you could decompose `webpack.parts.js` per category:
```
.
└── config
    ├── parts
    │   ├── devserver.js
    ...
    │   ├── index.js
    │   └── javascript.js
    └── ...
```
- This arrangement would make it faster to find configuration related to a category
- A good option would be to arrange the parts within a single file and use comments to split it up

## Conclusion

- Given webpack configuration is JavaScript code underneath, there are many ways to manage it.
- You should choose a method to compose configuration that makes the most sense to you
  - `webpack-merge` was developed to provide a light approach for composition, but you can find many other options in the wild.
- Webpack's `--env` parameter allows you to control configuration target through terminal. You receive the passed `env` through a function interface.
- Composition can enable configuration sharing. Instead of having to maintain a custom configuration per repository, you can share it across repositories this way.
  - using npm packages allows this. Developing configuration is close to developing any other code.
    - this time, however, you codify your practices as packages.

[Back to main](../readme.md)