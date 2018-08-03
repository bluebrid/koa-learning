const http = require('http')
const SKoa = require('./lib/application')
const Router = require('./lib/router')
const port = 3000
const host = '127.0.0.1'
// 实例化一个Skoa 对象
const app = new SKoa ()
// 实例化一个Router 对象
const router = new Router({});

router.get('/a', (req, res) => {
    res.end('Page a Get')
})
router.post('/a', (req, res) => {
    res.end('Page a Post')
})
router.del('/a', (req, res) => {
    res.end('Page a Del')
})
router.get('/b', (req, res) => {
    res.end('Page b Get')
})
router.post('/b', (req, res) => {
    res.end('Page B Post')
})
router.all('/d',  (req, res) => {
    res.end(`Page d ${req.method}`)
} )
// app 引用路由中间件
app.use(router.routes())
// 调用listen 方法， 创建一个server
app.listen(port, host, () => {
    console.log('The server is running at http://localhost:' + port)
})
 
