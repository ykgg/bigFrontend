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
    type: 'confirm',
    name: 'isInstall',
    message: "是否执行下载"
  },
  {
    type: 'list',
    choices: ['npm', 'cnpm', 'yarn'],
    name: 'method',
    message: "选择下载方式",
    when(val) {
      return val.isInstall
    }
  },
  {
    type: 'checkbox',
    choices: ['vueRouter', 'eslint', 'webpack', 'vue', 'react', 'react-dom', 'cba', 'nba'],
    name: 'feature',
    pageSize: 2,
    message: '选择初始化安装的功能'
  }
]

// 02 处理问题 
inquirer.prompt(quesList).then((answer) => {
  console.log(answer)
})

/**
 * 问题的类型
 * input list confirm checkbox
 * 钩子函数
 *  validate
 *  when
 * 常见属性
 *  type
 *  name
 *  choices
 *  message
 */