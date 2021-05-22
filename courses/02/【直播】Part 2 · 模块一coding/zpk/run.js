// 获取配置信息
const config = require('./webpack.config')

// 引入 webpack 
// const webpack = require('webpack')  // 这里的 webpack 是原生的，而我想用的是自己写的
const webpack = require('./lgPack')

// 将 config 传给 webpack ,从而获取到一个 compiler 
let compiler = webpack(config)

// 调用 compiler 身上的 run 方法来开启打包工作【 webpack可以0配置使用 】
compiler.run() 
