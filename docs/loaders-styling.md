# Loaders and styling notes

## References
- [Survive JS](https://survivejs.com/webpack/styling/loading/)
- [CSS Loader repo](https://github.com/webpack-contrib/css-loader)
- [Style Loader repo](https://github.com/webpack-contrib/style-loader#readme)
- [Survive JS webpack-demo repo](https://github.com/survivejs-demos/webpack-demo)

## Loaders

**NOTE: The Survive JS reference is running Webpack v4.20.2, newer versions of Webpack probably won't work with loaders**

- Webpack v4.23.1 works with `css-loader` and `style-loader`

Webpack enables use of loaders to preprocess files. This allows you to bundle any static resource way beyond JavaScript.
- You can easily write your own loaders using Node.js if you reaaaaally wanted to

Loaders are activated by using loadername! prefixes in `require()` statements, or are automatically applied via regex from your webpack configuration
– see configuration.

## CSS Loader

In order to load in CSS files into Webpack we need to install css-loader and styler-loader.

- *css-loader* goes through possible `@import` and `url()` lookups within the matched files and treats them as a regular ES2015 import.
  - if an `@import` points to an external resource, css-loader skips it as only internal resources get processed further by webpack.
- *style-loader* injects the styling through a `style` element. The way it does this can be customized
  - it also implements the Hot Module Replacement interface providing for a pleasant development experience

The matched files can be processed through loaders like `file-loader` or `url-loader`, and these possibilities are discussed in the Loading Assets part of the book.

- Inlining CSS isn't a good idea for production usage, so it makes sense to use `MiniCssExtractPlugin` to generate a separate CSS file
  - you will do this in the next chapter.
- To get started, we install `css-loader` and `style-loader` via npm
```
npm i -D css-loader style-loader
```

- Groovy, let's make sure they get loaded in by inserting the below into `webpack.parts.js`:
```js
exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: ["style-loader", "css-loader"],
      },
    ],
  },
});
```
- and then importing it into the main webpack config file
```js
const commonConfig = merge([
  ...

  parts.loadCSS(),

]);
```

- The added configuration means that files ending with `.css` should invoke the given loaders
  - the `test` property matches against a JavaScript-style regular expression.
- Loaders are transformations that are applied to source files, and return the new source and can be chained together like a pipe in Unix. They evaluated from right to left
  - this means that loaders: ["style-loader", "css-loader"] can be read as styleLoader(cssLoader(input)).
- *Extra notes*
  - if you want to disable css-loader url parsing set `url: false`. The same idea applies to @import. To disable parsing imports you can set import: false through the loader options
  - in case you don't need HMR capability, support for old Internet Explorer, and source maps, consider using `micro-style-loader` instead of style-loader.

## Additional loaders

Since there's a whole bunch of CSS preprocessors, it stands that there'll be loaders for each of them.

### Sass-loader

Should be pretty self-explanatory, install the below package to start:
```
npm i -D sass-loader
```
- **ALSO BE SURE TO INSTALL** `node-sass` **FIRST**

Then add a `scss` file test with the below rules:
```js
module: {
    rules: [
      {
        test: /\.scss$/,
        include,
        exclude,

        use: ["style-loader", "css-loader","sass-loader"],
      },
    ],
  }

```
- If you want more performance, there's also [fast-sass-loader](https://www.npmjs.com/package/fast-sass-loader) but this has some downsides in comparison.
  - said downsides are listed in a nice table in the npm page

## Loader lookups

So a couple of things about css-loader and how it performs lookups.

- `css-loader` handles relative imports by default, but doesn't touch absolute imports (`url('img/path/here.png')`)
  - if you rely on this kind of imports, you have to copy the files to your project
  - `copy-webpack-plugin` works for this purpose, but you can also copy the files outside of webpack.
  - the benefit of the former approach is that `webpack-dev-server` can pick that up.
- `resolve-url-loader` comes in handy if you use Sass or Less. It adds support for relative imports to the environments
  - if you use `fast-sass-loader` you won't need `resolve-url-loader`, but again it has downsides

If you want to process css-loader imports in a specific way, you should set up `importLoaders` option to a number that tells the loader how many loaders before the css-loader should be executed against the imports found
- this is vital if you're importing other CSS files via `@import` and want to use another loader before `css-loader`
  - i.e you have a `main.scss` file with a bunch of imports and you want to parse those files first

Consider the following import from a CSS file:
```css
@import "./variables.sass";
```
You'd need to add the below module rule for it to import the sass file:
```js
{
  test: /\.css$/,
  use: [
    "style-loader", // by default this gets parsed as {loader:'style-loader'},
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
      },
    },
    "sass-loader",
  ],
},
```

## Loading from `node_modules` directory

Some libraries have their own styles that you'll want to import into your page.

See the below import for example:
```css
@import "~bootstrap/less/bootstrap";
```
- The tilde(`~`) tells webpack that its not a relative lookup by default and that it should start in `node_modules` before looking through the rest of the file path
  - this is also configurable in the [resolve.modules](https://webpack.js.org/configuration/resolve/#src/components/Sidebar/Sidebar.jsx) field

## Source maps and CSS

- If you want to enable source maps for CSS, you should enable `sourceMap` option for `css-loader` and set `output.publicPath` to an absolute url pointing to your development server
  - Should look kind of like the below:
```js
module.exports = {
  entry: './src/index.js,
  output: {
    publicPath: 'http://localhost:8080/' // this is DEVELOPMENT ONLY
  }
  devServer: {
    stats: "errors-only",

    host: process.env.HOST, // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
    open: true, // Open the page in browser
    overlay: true, // err6r reporting
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack demo",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: [
          "style-loader",
          {
            loader:"css-loader",
            sourceMap:true,
          }
        ],
      },
    ],
  },
};
```
- If you have multiple loaders in a chain, you have to enable source maps separately for each. `css-loader` issue 29 discusses this problem further.

## Loader options

You can toggle a variety of options when you use loaders.
- see the [webpack reference](https://webpack.js.org/configuration/module/#module-rules) on it for more

## Conclusion

Webpack can load a variety of style formats. The approaches covered here write the styling to JavaScript bundles by default.

To recap:

- `css-loader` evaluates the @import and url() definitions of your styling
- `style-loader` converts it to JavaScript and implements webpack's Hot Module Replacement interface.
- Webpack supports a large variety of formats compiling to CSS through loaders. These include Sass, Less, and Stylus.
- `css-loader` doesn't touch absolute imports by default
  - it allows customization of loading behavior through the `importLoaders` option
- You can perform lookups against `node_modules` by prefixing your imports with a tilde (~) character.
- To use source maps, you have to enable `sourceMap` boolean through each style loader you are using **except** for `style-loader`
  - you should also set `output.publicPath` to an absolute url that points to your development server.

Although the loading approach covered here is enough for development purposes, it's not ideal for production. You'll learn why and how to solve this in the next chapter by separating CSS from the source.

[Back to top](#Loaders-and-styling-notes)

[Back to main](../readme.md)