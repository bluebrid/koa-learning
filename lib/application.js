const http = require('http')
const Emitter = require('events')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const compose = require('./compose')
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
/**
 * step-5
 * 1, 在step-4, 我们已经将Skoa 和Rourter 分离，而且已经提及了中间件的概念， 并且已经将Router 封装成了一个简单中间件，而且在SKoa 中引用了这个中间件
 * 2，现在我们的思路是要实现一个日志记录的中间件logger，用来记录请求的时间， 需要记录从请求一开始到响应的时间
 * 3，从请求一开始，就要进入该中间件，然后去执行所有其他的中间件，然后在返回这个中间件，但是中间件是一个先进先出的队列，
 * 所以我们要实现一个Next 方法，通过调用Next 方法，来直接调用下一个中间件
 * 4，中间件，都有可能是异步的，所以需要处理异步操作，我们需要对中间件用async await 进行处理
 * 5，正对上面几点，我们对SKoa 进行进一步处理，而且封装一个Logger 的中间件
 */
/**
 * step-6
 * 1,在step-5, 我们已经实现了简单的中间件功能，但是所有的中间件，我们都是对每个请求的request 和response 进行了操作
 * 2,每次对中间件进行操作时，我们都是传递req和res,很麻烦，所以我们思考需要抽离一个上下文，每次都是对上下文进行操作，
 * 3,所谓的上下文(context),其实也就是对req和res 进行封装，便于操作
 * 4,这一章节，我们的目的是抽离一个上下文
 * 5, 我们首先将Request 和Response mapping 成一个两个单独的文件
 * 6, 我们再创建一个Context 的对象，这个对象中有reqest和response 两个对象，用来操作请求的req 和res,
 * 7, 我们需要在serverCallBack 中去初始化上下文， 添加一个实例化方法createContext, 传入req, res, 返回一个上下文
 */
/**
 * step-7
 * 1, 上一章节，我们已经对request , response ,context 进行了简单的抽离封装，但是发现我们的Router是直接进行, 我们需要修改成：  Promise.resolve(targetRouter.middleware(ctx)).then(next());
 * 2，一般一个请求，如果找不到对应的路由，不应该直接在后端抛出异常，而且应该返回相关信息给前端，告知接口不存在，返回status: 404, body: Not Found
 * 3, 一般项目模块变多，API请求也就越来越多，我们会想对不同的业务模块的API进行分类封装，形成一个个单独的Router 文件，但是最终会合并成一个Router作为SKoa 的一个中间件，
 * 我们可以将每一个单独模块的Router 当作一个路由的中间件， 所以我们要在Router模块中实现一个use 的方法，来引用所有的单独的路由模块
 * 4, Router 也有中间件的概率，其执行方式和Skoa 中间件执行方式一致，使用doMiddleware处理中间件， 所以我们需要将doMiddleware 方法抽离出来，形成一个通用的模块，
 * 这个模块的主要功能是来组成中间件的执行，所以我们可以创建一个compose(英文翻译： 构成，组成)的模块
 */
class SKoa extends Emitter {
    constructor() {
        super()
        this.middleware = [];
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
    }

    listen(...arg) {
        http.createServer(this.serverCallBack()).listen(...arg)
    }

    serverCallBack() {
        const fn = compose(this.middleware)
        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res)
            const handleResponse = () => respond(ctx);
            const onerror = err => ctx.onerror(err);
            // 所有的中间件执行完成后，要返回response 到前端， 同时添加异常处理
            try{
                fn(ctx).then(handleResponse).catch(onerror)
            }catch(err) {
                console.log(err)
            }
            
        }
        return handleRequest
    }
    use(middleware) {
        this.middleware.push(middleware);
    }
    /**
     * 只是将req, res 绑定到context 对象上, 创建上下文
     * @param {*} req 
     * @param {*} res 
     */
    createContext(req, res) {
        const context = Object.create(this.context);
        const request = context.request = Object.create(this.request);
        const response = context.response = Object.create(this.response);
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        context.originalUrl = request.originalUrl = req.url;
        context.state = {};
        return context;

    }
}
function respond(ctx) {    
    let body = ctx.body; 
    body = JSON.stringify(body);
    ctx.res.end(body);
}

module.exports = SKoa