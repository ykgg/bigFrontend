const chalk = require('chalk')

// 1 文字颜色
console.log(chalk.red('红红火火就是zcegg'))
console.log(chalk.keyword('green')('zce'))
console.log(chalk.hex('#fff')('白色的文字'))

// 2 背景颜色 
console.log(chalk.bgYellow('zce'))

// 3 格式化输出
console.log(chalk.green`
  大前端
  学不动
`)