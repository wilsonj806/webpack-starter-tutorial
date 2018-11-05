# Webpack starter tutorial

## References:
- [Surviving JS](https://survivejs.com/webpack/developing/getting-started/)
- [Webpack Docs](https://webpack.js.org/guides/getting-started/)

## Notes

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