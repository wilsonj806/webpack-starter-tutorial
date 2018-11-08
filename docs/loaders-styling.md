# Loaders and styling notes

[Reference](https://survivejs.com/webpack/styling/loading/)

## Loaders

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

[Back to main](../readme.md)