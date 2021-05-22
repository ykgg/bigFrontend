const inquirer = require('inquirer')
const chalk = require('chalk')
/**
 * 01 需要它设计的格式来定义问题
 * 02 将问题交给它提供的方法进行处理
 * 03 从执行的结果中获取答案
 */

// 01 设计问题
const quesList = [
  {
    type: 'input',  // 当前属性用于定义问题的类型
    name: 'username',  // 当前属性用于将来从用户填写的答案里获取目标数据
    message: '请输入您的用户名',  // 用于设置输入框当中的提示文字
    // default: chalk.hex('#777')('zoe'),  // 用于设置默认值
    validate(val) {
      if (!val) {
        return '当前项为必填项'
      }
      return true
    }
  }
]

// 02 处理问题 
inquirer.prompt(quesList).then((answer) => {
  console.log(answer.username)
})