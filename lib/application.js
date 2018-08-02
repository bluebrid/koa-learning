const http = require('http')
const Emitter = require('events');
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
/**
 * 1, 上一章节，我们通过Http 的createServer 方法，创建了一个简单的Node js server, 而且实现了一个简单的Routor
 * 2, 这一章节，我们的目的是通过简单的封装，形成一个简单的类SKoa,通过new SKoa 创建一个server 
 * 3，NodeJS 大部分的类库，都实现了继承Events 类，所以Skoa 我们也继承Events
 * 4, SKoa ,首先要实现一个简单的listen 方法，去实现一个Server
 * 5, createServer 的Callback 抽离出来
 */

class SKoa extends Emitter {
    constructor() {
        super()
    }
    /**
     * 
     * @param {port, host, callback} arg 
     */
    listen(...arg) {
        http.createServer(this.serverCallBack()).listen(...arg)
    }
    serverCallBack() {
        return function (req, res) {
            /**
             *  1, 所有的请求都会经过这个回调函数(拦截所有的请求)console.log(req)
             *  2, 通过req.url 可以获取请求的路径console.log(req.url)
             *  3, 通过req.method 可以获取请求的方法console.log(req.method)
             *  根据上述三点，可以实现一个简单的路由,下面我们来实现一个简单的nodeJS 路由
             */
            const { method, url } = req
            // 如果请求方法，没有定义，直接返回一个500
            if (!methods.includes(method.toUpperCase())) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain',
                    'Agent': 'New Koa'
                })
                res.end(`OOOPs, Incorrect Request Method. Please Try Again.`)
                return;
            }
            let response = '';
            // 相当于是一个简单的路由，根据URL 和Method 返回不同的结果
            switch (url) {
                case '/':
                case '/a':
                case '/b':
                    response = `Request: ${url}, Method: ${method}`
                    break;
                default:
                    response = `Request: ${url}, Method: ${method}, But Can't Find this router`
                    break;
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Agent': 'New Koa'
            })
            res.end(response)
        }
    }
}
module.exports= SKoa