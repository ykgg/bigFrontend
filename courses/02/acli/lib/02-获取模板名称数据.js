const axios = require('axios')
const inquirer = require('inquirer')

// 
module.exports = async (params) => {
  const headers = { "Authorization": "token " + "38a713cb0fdf915d2f82c01457768378c40583e1" }
  const tempNames = await axios({
    method: 'get',
    url: 'https://api.github.com/users/zcegg/repos',
    headers: headers
  }).then(response => response.data)

  const repoNames = tempNames.map(temp => temp.name)

  // 设计一个问题选择指定的模板名称
  const quesList = [
    {
      type: 'list',
      choices: repoNames,
      message: '请选择模板名称',
      name: 'repoName'
    }
  ]
  inquirer.prompt(quesList).then(answer => console.log(answer))
}

