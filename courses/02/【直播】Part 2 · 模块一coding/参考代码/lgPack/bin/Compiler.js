const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const parser = require('@babel/parser')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

class Compiler {
  constructor(config) {
    this.config = config  // 所有的配置信息
    this.context = process.cwd()  // 当前工作目录
    this.entryId = config.entry  // 记录当前主入口
    this.entries = []  // 用于保存所有的入口模块 id 
    this.modules = {}  // 保存模块id与它对应的内容信息
  }

  /**
   * 接收一个 code，然后完成具体内容替换和源码转换
   * @param {*} code 需要解析的模块代码
   */
  parse(code, parentDir) {

    // 记录当前 module 中需要加载的依赖模块
    let dependenciesModule = []

    // 01 获取 code 对应的 ast 语法树 
    let ast = parser.parse(code)

    // 02 遍历语法树，修改内容，保存信息 
    traverse(ast, {
      CallExpression: (nodePath) => {
        let node = nodePath.node
        if (node.callee.name === 'require') {
          // 代码执行到这里就说明我们需要完成二件事情
          // 第一件：将 ./a.js ./lg/b.js ===》 ./src/a.js ./src/lg/b.js
          let depModule = node.arguments[0].value  // 获取初始值 
          depModule = "./" + path.posix.join('src/', depModule) // 动态添加相对路径目录
          let extName = path.extname(depModule) === '.js' ? '' : '.js'
          depModule += extName

          dependenciesModule.push(depModule)  // 记录当前模块需要加载的依赖模块

          // 第二件：将 require 替换成 __webpack_require__ 方法
          node.callee.name = "__webpack_require__"
          node.arguments = [types.stringLiteral(depModule)]
        }
      }
    })

    // 03 将修改后的 ast 再转为可运行的 code 
    let sourceCode = generator(ast).code

    return { dependenciesModule, sourceCode }
  }

  /**
   * 接收模块的路径，读取其中的所有内容，用于实现内容替换
   * @param {*} modulePath 当前模块的绝对路径
   * @param {*} isEntry 当前是否为入口模块
   */
  buildModule(modulePath, isEntry) {
    // 01 将来需要使用到 ./src/a.js  因此我们需要从 modulePath 中截取出相对路径
    let moduleId = "./" + path.posix.relative(this.context, modulePath)

    // 02 判断当前是否为主入口，如果是则单独记录【将来递归的执行和结束都需要依赖它】
    if (isEntry) {
      this.entries.push(moduleId)
    }

    // 03 读取本次被打包模块的内容，
    let source = fs.readFileSync(modulePath, 'utf-8')

    // 04 完成内容解析【替换--再还回至code】
    let { sourceCode, dependenciesModule } = this.parse(source, path.dirname(moduleId))

    // 05 依据第一步和第四步的结果，组装 {key: value}结构
    this.modules[moduleId] = sourceCode

    // 06 递归调用上述的操作，完成一个chunk里所有的 module 的打包 
    dependenciesModule.forEach(dep => {
      this.buildModule(path.posix.join(this.context, dep), false)
    })

  }

  /**
   * 将打包后的内容组装之后输出至磁盘文件
   */
  emitFile() {
    // 01 确定将来最终输出的文件路径
    let finalPath = path.join(this.config.output.path, this.config.output.filename)

    // 02 依据当前路径是否存在来决定是否创建
    let outputPath = path.dirname(finalPath)
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true })
    }

    // 03 读取模板内容
    let tempCode = fs.readFileSync(path.resolve(__dirname, 'main.ejs'), 'utf-8')

    // 04 渲染数据
    let retCode = ejs.render(tempCode, { entryModuleId: this.entryId, modules: this.modules })

    // 05 写入磁盘
    fs.writeFileSync(finalPath, retCode)
  }

  run() {
    // 1 依据入口模块以及它内部的引用关闭将所有的需要的模块内容组装成一个 chunk
    let modulePath = path.posix.join(this.context, this.entryId)

    // 第一次调用的时候必然是主入口，因此肯定是 true 
    this.buildModule(modulePath, true)

    // 2 将组装好的 chunk 再经过文件系统写入到磁盘上
    this.emitFile()
  }
}

module.exports = Compiler
