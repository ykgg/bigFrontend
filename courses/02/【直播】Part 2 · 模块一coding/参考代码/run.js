// const webpack = require('webpack')
const webpack = require('./lgPack')

const config = require('./webpack.config')

let compiler = webpack(config)

compiler.run()

