const http = require('http')
const port = 3000
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
http.createServer((req, res) => {
    /**
     *  1, 所有的请求都会经过这个回调函数(拦截所有的请求)console.log(req)
     *  2, 通过req.url 可以获取请求的路径console.log(req.url)
     *  3, 通过req.method 可以获取请求的方法console.log(req.method)
     *  根据上述三点，可以实现一个简单的路由,下面我们来实现一个简单的nodeJS 路由
     */
    const {method , url} = req
    // 如果请求方法，没有定义，直接返回一个500
    if (!methods.includes(method.toUpperCase())) {
        res.writeHead(500, {
            'Content-Type': 'text/plain',
            'Agent': 'New Koa'
        })
        res.end(`OOOPs, Incorrect Request Method. Please Try Again.`)
        return ;
    }
    let response = '';
    // 相当于是一个简单的路由，根据URL 和Method 返回不同的结果
    switch(url) {
        case '/' :
        case '/a' :
        case '/b': 
        response = `Request: ${url}, Method: ${method}`
        break;         
        default :
        response = `Request: ${url}, Method: ${method}, But Can't Find this router`
        break;
    }
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Agent': 'New Koa'
    })
    res.end(response)
}).listen(port, '127.0.0.1', () => {
    console.log('The server is running at http://localhost:' + port)
})

