const delegate = require('delegates');
/**
 * context，是一个上下文， 需要将request , response , SKoa实例化对象都封装起来， 在中间件中只需要操作该对象，不需要额外的资源
 * 先将request , response , app 封装到上下文
 */
const proto = module.exports = {
    toJSON() {
        return {
            request: this.request.toJSON(),
            response: this.response.toJSON(),
            app: this.app.toJSON(),
            originalUrl: this.originalUrl,
            req: '<original node req>',
            res: '<original node res>',
            socket: '<original node socket>'
        };
    }
}
delegate(proto, 'response')   
    .access('body')

delegate(proto, 'request')
    .access('method')
    