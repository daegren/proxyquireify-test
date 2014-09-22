# Watchify + Browserify + Proxyquireify

Trying to get watchify working with proxyquireify and browserify

 * [proxyquireify](https://github.com/thlorenz/proxyquireify/)
 * [browserify](https://github.com/substack/node-browserify/)
 * [watchify](https://github.com/substack/watchify)

# Steps to Reproduce

 1. `npm install`
 2. `gulp`
 3. Open `index.html` in browser
 4. Notice in console logs:

    ```js
    proxy // from proxied object in foo_spec.js
    ```
 5. Save `foo_spec.js` file
 6. Reload `index.html`
 7. Notice in console logs:

    ```js
    this // from bar.js
    ```
