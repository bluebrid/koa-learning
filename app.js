const http = require('http')
const SKoa = require('./lib/application')

const port = 3000
const host = '127.0.0.1'
// 实例化一个Skoa 对象
const app = new SKoa ()
// 调用listen 方法， 创建一个server
app.listen(port, host, () => {
    console.log('The server is running at http://localhost:' + port)
})
 
