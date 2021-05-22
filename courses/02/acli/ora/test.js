const ora = require('ora')

/**
 *
 */

const spinner = ora('正在下载')

spinner.start()
// 耗时操作
setTimeout(() => {
  console.log('......')
  spinner.fail('下载了......')
}, 2000)