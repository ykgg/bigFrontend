module.exports = (params) => {
  console.log('create执行了')
  console.log(params)
}

/**
 *  核心需求： 执行 acli crt XXX 在本地初始化一个项目
 *  核心步骤：
 *    01 发送请求，查询平台上有哪些模板
 *      提供模板列表供选择
 *      提供模板版本查询
 *    02 下载指定的模板至本地
 *      下载功能
 *      缓存至本地
 *    03 处理模板内容供使用
 *      数据渲染
 *      拷贝至当前项目的下面
 */