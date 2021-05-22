#! /usr/bin/env node
const { program } = require('commander')

// 1 默认情况下我们可以通过 process.argv 获取到所有的原生命令行参数，然后自己写代码让它们有一个很好的格式化输出
// 2 但是对于这种经常会用到的工具，同样会正在很多好用的开源工具包： commander  yargs ...
// console.log(process.argv)

program
  .command('create')
  .alias('crt')
  .description('创建一个项目')
  .action(() => {
    console.log('create命令执行了')
  })

program.parse(process.argv)

