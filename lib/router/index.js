const Emitter = require('events')
const methods = require('methods')
const Layer = require('./Layer')
const compose = require('../compose')
class Router extends Emitter {
    constructor(opts) {
        super()
        // 保存所有的参数
        this.opts = opts || {}
        //用一个实例化变量，保存所有的路由
        this.stack = []
    }
}

methods.forEach((m) => {
    /**
     * 至少传入两个参数，第一个参数为字符串， 第二个参数为回调函数
     */
    Router.prototype[m.toLowerCase()] = function () {
        let args = [].slice.call(arguments)
        if (args.length < 2) {
            throw Error('参数不对，必须传入两个以上参数')
        }
        if (args.length === 2 && Object.prototype.toString.call(args[0]) !== '[object String]') {
            throw Error('参数不对，第一个参数必须是一个字符串')
        }
        let callBack = args[args.length - 1]
        let url = args[0]
        let name = url

        this.register(name, url, [m], callBack, {})

    }
})
// 添加一个all 的方法， 不管请求的method 是什么，都会进入这个路由
Router.prototype.all = function () {
    let args = [].slice.call(arguments)
    if (args.length < 2) {
        throw Error('参数不对，必须传入两个以上参数')
    }
    if (args.length === 2 && Object.prototype.toString.call(args[0]) !== '[object String]') {
        throw Error('参数不对，第一个参数必须是一个字符串')
    }
    let callBack = args[args.length - 1]
    let url = args[0]
    let name = url
    const route = new Layer(name, url, methods, callBack, {
        prefix: this.opts.prefix
    })

    this.register(route)
}
/**
 * register 方法，就是注册对应的路由， 也就是将对应的路由放到路由实例化对象的stack 中保存起来
 * @param {路由的名称， 默认是url} name 
 * @param {请求的路径} url 
 * @param {methods 是一个数组， 是为了实现all 功能， 因为all 是使用所有的request请求} methods 
 * @param {中间件，也就是对应的回调函数} middleware 
 * @param {一些额外的参数} opts 
 */
Router.prototype.register = function (route) {
    this.stack.push(route)
    if (this.opts.prefix) {
        route.setPrefix(this.opts.prefix);
    }
}
// 将del 方法指向delete 方法，因为delete 是javascript 的保留字
Router.prototype.del = Router.prototype['delete']
// 定义一个routes 实例方法，用来处理路由
Router.prototype.routes = Router.prototype.middleware = function () {
    const dispatch = async (ctx, next) => {
        const { method, url } = ctx.request
        const matched = this.match(url, method)
        if (!matched.route) {
            const notFound = async (ctx) => {
                ctx.body = `Not Found`
                ctx.status = 404
            }
            Promise.resolve(notFound(ctx)).then(next())
        } else {
            let layerChain = matched.pathAndMethod.reduce ((memo, layer) => {
                return memo = memo.concat(layer.stack)
            }, [])
            compose(layerChain)(ctx).then(next())
        }
    }
    return dispatch
}
Router.prototype.match = function (path, method) {
    const layers = this.stack
    var matched = {
        pathAndMethod: [],
        route: false
    }
    const targetRouters = layers.filter(layer => layer.match(path) && layer.methods.find(m => m.toUpperCase() === method.toUpperCase()))
    if (targetRouters.length) {
        matched.pathAndMethod = targetRouters
        matched.route = true
    }
    return matched
}
Router.prototype.use = function () {
    const router = this
    const middleware = [].slice.call(arguments)
}
Router.prototype.prefix = function (prefix) {
    prefix = prefix.replace(/\/$/, '')
    this.opts.prefix = prefix;
    this.stack.forEach((route) => {
        route.url = prefix + route.url
    })
}
module.exports = Router