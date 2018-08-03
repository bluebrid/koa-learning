const http = require('http')
const Emitter = require('events');

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
/**
 * step-4
 * 1, 在step-3 , 我们已经实现了Skoa server的简单封装， 而且已经实现了简单的路由
 * 2，一般框架都是想达到单一职责，任何模块只负责单一的职责，但是目前为止，SKoa,实现了接收请求，
 * 并且分发路由的功能，没有达到单一职责，所以我们这个环节，我们会将路由给抽离出来，形成一个路由Router 模块，
 * 3，这一章节，我们将会实现路由管控，一个独立的模块
 * 4，既然路由模块是一个单独模块，那需要考虑怎么将路由模块给引入到Skoa 中，我们可以当Router 模块当作是一个插件
 * 并且将Router 查看当作是SKoa 的一个插件，而且Skoa 可以引用多个插件，也就是插拔式编程，插件对应前端的概念就是中间件。
 * 5， 本章节，我们实现抽离Router 是一个单独的中间件，Skoa 实现引用中间件
 * 6, Skoa 引用中间件，需要定义一个use 方法， 传入一个中间件，并且保存在这个实力对象中，
 */
class SKoa extends Emitter {
    constructor() {
        super()         
        this.middleware = [];
    }

    listen(...arg) {
        http.createServer(this.serverCallBack()).listen(...arg)
    }

    serverCallBack() {
        const handleRequest = (req, res) => {
            // 执行中间件，先进先出
            this.middleware.forEach(m=> m(req, res))
        }
        return handleRequest
    }
    use(middleware) {
        this.middleware.push(middleware);
    }
}

module.exports = SKoa