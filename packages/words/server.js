const server = require('./lib/server')
const Logger = require('./lib/logger')
const route = require('./route')
const sub = require('./sub')
let config = require('config')
server.g.logger = new Logger('word', 'server')
async function main(){
  // sub init
  await sub.init()

  // start services
  server.app.use('/', route)
  // route要在start前
  server.start(config.host,config.port)
}
main()
