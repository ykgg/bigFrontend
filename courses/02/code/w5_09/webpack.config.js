const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'production',
  devtool: false,
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack')
  },
  entry: {
    main: './src/index.js'
  },
  optimization: {
    chunkIds: 'deterministic',// 生成 chunk 的命名规则
    moduleIds: 'deterministic' // 生成 module 的命名规则
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer"),
      "stream": require.resolve("stream-browserify"),
    }
  },
  devServer: {
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          }
        ]
      },
      {
        test: /\.png$/,
        type: 'asset/inline'  // 当前的写法就等同于之前的 url-loader + limit 体积限制
      },
      {
        test: /\.ico$/,
        type: 'asset/resource'  // 当前的写法就相当于之前的 file-loader
      },
      {
        test: /\.txt$/,
        type: 'asset/source'  // 当前的写法就相当于之前的 raw-loader 
      },
      {
        test: /\.jpg$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}