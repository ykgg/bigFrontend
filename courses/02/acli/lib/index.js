
module.exports = (actionName, params) => {
  // 我们不会将所有的 action 对应的业务代码都放在一个 index.js 文件
  // 因此我们单独新建了 create.js config.js 
  // 那么此处需要做的事情就是依据当前传入的 actionName 来决定导入哪个一个模块
  require('./' + actionName)(params)
}