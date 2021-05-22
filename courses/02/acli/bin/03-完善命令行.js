#! /usr/bin/env node
const version = require('../package.json').version
const { program } = require('commander')

// 1 我需要有一个数据结构来存放多条命令的信息  
const actionMap = {
  create: {
    alias: 'crt',
    des: '创建项目',
    examples: ['acli create|crt <projectName>']
  },
  config: {
    alias: 'cfg',
    des: '配置项目',
    examples: [
      'acli config|cfg set <k> <v>',
      'acli config|cfg get <k>',
    ]
  }
}

// 2 使用循环配合 program 来格式化命令行参数
Object.keys(actionMap).forEach(action => {
  program
    .command(action)
    .alias(actionMap[action].alias)
    .description(actionMap[action].des)
    .action(() => {
      console.log(action, '执行了.....')
    })
})

program.on('--help', () => {
  console.log('Examples: ')
  Object.keys(actionMap).forEach(action => {
    actionMap[action].examples.forEach(item => console.log("　" + item))
  })
})

program.version(version).parse(process.argv)

