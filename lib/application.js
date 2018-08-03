const http = require('http')
const Emitter = require('events');
const methods = require('methods');
/**
 * step-2
 * 1, 上一章节，我们通过Http 的createServer 方法，创建了一个简单的Node js server, 而且实现了一个简单的Routor
 * 2, 这一章节，我们的目的是通过简单的封装，形成一个简单的类SKoa,通过new SKoa 创建一个server 
 * 3，NodeJS 大部分的类库，都实现了继承Events 类，所以Skoa 我们也继承Events
 * 4, SKoa ,首先要实现一个简单的listen 方法，去实现一个Server
 * 5, createServer 的Callback 抽离出来 
 */
/**
 * step-3
 * 1, 上一章节，我们已经抽离除了一个Skoa 的类， 现在我们要对这个类进一步封装，将所有的request method 挂载在这个类上面
 * 2, 实现app.get('/a', (req, res) => {}), app.post('/a', (req, res) => {})
 * 3, 在一章节，我们定义了一个methods 的数组， 保存了一些请求方法类型，现有一个NodeJs库methods ,里面涵盖了所有的请求方法,
 * 4, 定义一个实例化变量routers,用来保存所有的路由，
 * 5，重构serverCallBack 方法， 拦截所有的请求，根据url 匹配，从routers 中查找对应的回调函数
 * 6, 在应用中，就可以直接编写路由了。
 */
class SKoa extends Emitter {
    constructor() {
        super()
        this.routers = [];
    }

    listen(...arg) {
        http.createServer(this.serverCallBack()).listen(...arg)
    }

    serverCallBack() {
        const handleRequest = (req, res) => {
            const { method, url } = req
            const targetRouter = this.routers.find(r => r.url.toUpperCase() === url.toUpperCase() && r.method.toUpperCase() === method.toUpperCase())
            if (!targetRouter) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain',
                    'Agent': 'New Koa'
                })
                res.end(`OOOPs, Incorrect Request Method. Please Try Again.`)
                return;
            }
            targetRouter.callBack(req, res);
        }
        return handleRequest
    }
}

methods.forEach((m) => {
    /**
     * 至少传入两个参数，第一个参数为字符串， 第二个参数为回调函数
     */
    SKoa.prototype[m.toLowerCase()] = function () {
        let args = [].slice.call(arguments)
        if (args.length < 2) {
            throw Error('参数不对，必须传入两个以上参数')
        }
        if (args.length === 2 && Object.prototype.toString.call(args[0]) !== '[object String]') {
            throw Error('参数不对，第一个参数必须是一个字符串')
        }
        let callBack = args[args.length - 1]
        let url = args[0]
        return this.routers.push({
            url: url,
            method: m.toUpperCase(),
            callBack, callBack
        })

    }
})
// 将del 方法指向delete 方法，因为delete 是javascript 的保留字
SKoa.prototype.del = SKoa.prototype['delete'];
module.exports = SKoa