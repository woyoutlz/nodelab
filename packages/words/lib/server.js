const express = require('express')
const app = express()
const http = require('http').Server(app)
const morgan = require('morgan')
const bodyParser = require('body-parser')
// const cors = require('cors')
var swig = require('swig')
swig.setDefaults({
  varControls: ['{{ ', ' }}']
})
// 供改变的变量
let g = {
  logger: console
}
morgan.token('localedate', function (req, res) { return new Date().toLocaleString() })
morgan.token('ips', function (req, res) { return req.headers['x-forwarded-for'] })
app.use(morgan(':localedate|[RESTful][:method]|url=:url,status=:status,response-time=:response-time ms,ip=:ips'))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cors())
app.set('views', './views')
app.engine('html', swig.renderFile);
app.set('view engine', 'html')

async function start(host, port) {
  app.use(express.static('public'))
  app.use((req, res, next) => {
    let e = new Error('404')
    e.status = 404
    throw e
  })
  app.use((err, req, res, next) => {
    const status = err.status || 500
    if (status == 500) {
      g.logger.error(err)
    }
    res.status(status).json({ 'code': 1, status: status, msg: err.message })
  })
  port = port || 3039
  host = host || undefined
  http.listen(port, host, () => g.logger.log("[httpserver]",`port=${port}`))
}

module.exports = {
  start,
  g,
  app
}