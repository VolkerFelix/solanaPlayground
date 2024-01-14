# ticTacToeReact
Based on the official [React tutorial](https://react.dev/learn/tutorial-tic-tac-toe)

## How to run
```
npm install
npm run
```
Polyfills needed due to Webpack 5.  
Add the following to 'resolve' in /node_modules/react-scripts/config/webpack.config.js:
```  
fallback: {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify")
}
```