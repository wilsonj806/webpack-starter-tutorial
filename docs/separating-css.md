# Separating CSS

## References

- [Survive JS](https://survivejs.com/webpack/styling/separating-css/)

## Intro

So if we look at our dev server, we'll see that our styling is actually injected inline rather than read via a `<link>` tag.

In addition, the current solution doesn't allow for cached CSS, which means on larger CSS or JS files we can get a Flash of Unstyled Content.

So we'll want to separate our CSS from the JS into its own file so that the browser can handle it separately.

This section is about solving that problem, especially for production.

## Mini CSS Extract

The solution to the above problem is in the form of a plugin called `mini-css-extract-plugin`.

It can aggregate multiple CSS files into a single one, and comes with a loader to handle extraction.

To install use:
```npm
npm i -D mini-css-extract-plugin
```

`MiniCssExtractPlugin` includes a loader, `MiniCssExtractPlugin.loader` that marks the assets to be extracted. Then a plugin performs its work based on this annotation.

We'll need to add the below to `webpack.parts.js`:
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Node import

exports.extractCSS = ({ include, exclude, use = [] }) => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({ // add plugin via webpack-merge syntax
    filename: "[name].css", // file to look for
  });

  return { // public object to return to our export
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: [
            MiniCssExtractPlugin.loader,
          ].concat(use),
        },
      ],
    },
    plugins: [plugin],
  };
};
```

- That `[name]` placeholder uses the name of the entry where the CSS is referred
  - placeholders and hashing are discussed in detail in the Adding Hashes to Filenames chapter.
- A file path can be specified as well in the `filename` field