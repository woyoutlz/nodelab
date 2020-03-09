const rootroute = require('../../route')
const route = require('./route')
// const task = require('./task')

async function init_route(){
  rootroute.use('/api',(req,res,next)=>{
    res.removeHeader("X-Powered-By")
    next()
  }, route)
}
async function init(){
  // await api.init_login()
  init_route()
  // task.init()
}
module.exports = {
  init
}




