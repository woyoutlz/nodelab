let project = require('./project')
// let user = require('./user')
async function init(){
  await project.init()
  // await user.init()
}

module.exports = {
  init
}