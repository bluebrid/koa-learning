const http = require('http')
const SKoa = require('./lib/application')
const Router = require('./lib/router')
const Logger = require('./lib/logger')
const port = 3000
const host = '127.0.0.1'
// 实例化一个Skoa 对象
const app = new SKoa()
// 实例化一个Router 对象
const router = new Router({});

router.all('/d', async (req, res) => {
    console.log('..................')
    res.end(`Page d ${req.method}`)
})
app.use(new Logger({name: 'Demo'}).log())
app.use(async (req, res, next) => {
    console.log('===============>')
    await next()
})

// app 引用路由中间件
app.use(router.routes())
app.use(async (req, res, next) => {
    console.log('=========ffffffffffffff======>')
    await next()
})

// 调用listen 方法， 创建一个server
app.listen(port, host, () => {
    console.log('The server is running at http://localhost:' + port)
})

