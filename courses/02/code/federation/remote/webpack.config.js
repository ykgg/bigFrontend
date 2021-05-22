const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  devServer: {
    port: 7070
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
      // 此时我们是将这 Header 模块往外导
      name: 'remote',  //这个 name 的值在将来就会被其它应用当做是一个 人，通过这个人我们就可以找到 remote 应用里的所有东西
      filename: 'remoteHeader.js',  // 我们要导出的 Header 组件在将来必然是为会以文件的形态存在，而这里的.....
      exposes: {
        "./Header": "./src/Header.js"
      }
    })
  ]
}