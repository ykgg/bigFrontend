let Compiler = require('./Compiler')


const webpack = (config) => {
  let compiler = new Compiler(config)
  return compiler
}

module.exports = webpack 
