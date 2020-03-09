const router = require('express-promise-router')()
const Logger = require('../../lib/logger')
const logger = new Logger('ieoserver', 'route')
var timeout = require('connect-timeout')
let config = require('config')

router.route("/").get((req, res) => {
  res.render("index")
})
router.route("/ping").get((req, res) => {
  res.send("ok")
})
const login_router = require('express-promise-router')()
router.use('/v1', login_router, error_handle)

function error_handle(err, req, res, next) {
  const status = err.status || 500
  if (status == 500) {
    logger.error(err)
  }
  res.status(status).json({
    'code': -1,
    result: err.message
  })
}

function error_nohandle(err, req, res, next) {
  const status = err.status || 500
  if (status == 500) {
    logger.error('url:', req.originalUrl, 'query:', JSON.stringify(req.query), 'body:', JSON.stringify(req.body), err)
  }
  let err_msg = "err2"
  if (err.message.length < 100) {
    err_msg = err.message
    if (error_types[err_msg]) {
      err_msg = error_types[err_msg]
    }
  }
  res.status(status).json({
    'code': -1,
    result: err_msg
  })
}
router.route('/hello').get(async (req, res) => {
  // 是否密码正确
  res.send({name:"router"})
})
login_router.route('/hello').get(async (req, res) => {
  // 是否密码正确
  res.send({name:"login_router"})
})
// cybex_router.route('/timeout').get(async (req, res) => {

// })
module.exports = router