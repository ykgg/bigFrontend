const fs = require('fs')
const { parse } = require('path')
const path = require('path')
const parser = require('@babel/parser')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

class Compiler {
  constructor(config) {
    this.config = config
    this.context = process.cwd()
    this.entryId = config.entry
    this.entries = []
  }

  /**
   * 接收一个模块的源代码，然后将它里面的 require 及 相对路径进行替换
   * @param {*} code 字符串，它就是我们需要解析的源代码内容
   */
  parse(code, parentDir) {

    let dependenciesModule = []

    // 01 利用 babel 将字符串类型的源码转为 ast 语法树  
    let ast = parser.parse(code)

    // 02 遍历语法树节点，进行内容的替换和信息的保存 
    traverse(ast, {
      CallExpression: (nodePath) => {
        let node = nodePath.node
        if (node.callee.name == 'require') {
          // 代码走到这里之后就说明我们已经从 ast 上截获取了 require 的操作
          // 01 将 require 替换成 __webpack__require__
          let depModule = node.arguments[0].value
          depModule = "./" + path.posix.join(parentDir, depModule)
          let extName = path.extname(depModule) === '.js' ? "" : '.js'
          depModule += extName

          // 上述处理完成的 depModule 很有用，就是我们将来需要递归加载的依赖项，因此我们需要将它保存起来
          // 为了在下次递归调用的时候可以进行使用
          dependenciesModule.push(depModule)

          // 02 将 require 的值替换成 ./src/a.js ./src/lg/b.js
          node.callee.name = "__webpack_require__"
          node.arguments = [types.stringLiteral(depModule)]
        }
      }
    })

    // 03 将第二步处理好的语法树再转为可执行的 code 
    let sourceCode = generator(ast).code
    console.log(sourceCode)

    // 04 返回我们解析之后的数据
  }

  /**
   * 将当前被打包模块及它的依赖模块串起来，生成一个 chunk 
   * @param {*} modulePath 表示当前被打包模块的绝对路径，用于读取它里面的内容
   * @param {*} isEntry 布尔值，表示当前被打包模块是否为为主 entry
   */
  buildModule(modulePath, isEntry) {
    // 01 我们需要获取到当前被打包模块的相对路径（ ./src/index.js ）
    let moduleId = "./" + path.posix.relative(this.context, modulePath)

    // 02 依据当前是否为主入口id，如果是则将它单独保存起来（什么时候结束递归）
    if (isEntry) {
      this.entries.push(moduleId)
    }

    // 03 读取出当前次被打包模块的所有内容（ 便于内容替换和保存信息 ）
    let source = fs.readFileSync(modulePath, 'utf-8')

    // 04 利用 AST 语法树操作完成代码的修改和替换（  ）
    this.parse(source, path.dirname(moduleId))

    // 05 依据第一步和第四步的结果来组装 key value 

    // 06 递归调用上述的步骤来完成它自己和它自己所依赖模块的打包 
  }

  run() {
    // 1 依据配置文件当中的 entry 入口 来打包它自己和它自己所依赖的模块们，生成一个 chunk 
    let modulePath = path.posix.join(this.context, this.entryId)
    this.buildModule(modulePath, true)

    // 2 将上述的chunk 写入到磁盘文件中 

  }
}

module.exports = Compiler