import { fn3 } from './m2'

export function fn1() {
  console.log('fn1')
}
export function fn2() {
  console.log('fn2', fn3)
}
/**
 * 导出自己的变量
 * 导入m2 里的变量
 */