const express = require('express')
const app = express()
const http = require('http').Server(app)
const config = require("config")
let port = config.port || 3360
let host = config.host || "127.0.0.1"
app.get("/call",function(req,res){
  res.send("use post")
})
app.post("/call",function(req,res){
  res.send("hello1")
})
app.use((err, req, res, next) => {
  const status = err.status || 500
  if (status == 500) {
    g.logger.error(err)
  }
  res.status(status).json({ 'code': 1, status: status, msg: err.message })
})
http.listen(port, host, () => console.log("[httpserver]",`port=${port}`))