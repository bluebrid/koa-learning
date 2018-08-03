const http = require('http')
const SKoa = require('./lib/application')

const port = 3000
const host = '127.0.0.1'
// 实例化一个Skoa 对象
const app = new SKoa ()
app.get('/a', (req, res) => {
    res.end('Page a Get')
})
app.post('/a', (req, res) => {
    res.end('Page a Post')
})
app.del('/a', (req, res) => {
    res.end('Page a Del')
})
app.get('/b', (req, res) => {
    res.end('Page b Get')
})
app.post('/b', (req, res) => {
    res.end('Page B Post')
})
// 调用listen 方法， 创建一个server
app.listen(port, host, () => {
    console.log('The server is running at http://localhost:' + port)
})
 
