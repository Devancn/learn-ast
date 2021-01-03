const path = require('path');

module.exports={
  module: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [path.resolve(__dirname, 'babel-plugin-import.js'), {
                libraryName: "lodash",
                libraryDirectory: "fp"
              }]
            ]
          }
        }
      }
    ]
  }
}