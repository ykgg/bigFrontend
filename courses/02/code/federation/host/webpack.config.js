const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  devServer: {
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new ModuleFederationPlugin({
      // 此时我们是将这 Header 模块往里拿
      name: "host",
      remotes: {
        "abc": "remote@http://localhost:7070/remoteHeader.js"
      }
    })
  ]
}