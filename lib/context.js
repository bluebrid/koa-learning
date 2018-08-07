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
    },
    onerror(err) {       
        if (null == err) return;
        if (!(err instanceof Error)) err = new Error(util.format('non-error thrown: %j', err));
        let headerSent = false;
        if (this.headerSent || !this.writable) {
            headerSent = err.headerSent = true;
        }      
        this.app.emit('error', err, this);
        if (headerSent) {
            return;
        }
        const { res } = this;
        if (typeof res.getHeaderNames === 'function') {
            res.getHeaderNames().forEach(name => res.removeHeader(name));
        } else {
            res._headers = {}; // Node < 7.7
        }
       
        this.set(err.headers);
       
        this.type = 'text';

        // ENOENT support
        if ('ENOENT' == err.code) err.status = 404;

        // default to 500
        if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;

        // respond
        const code = statuses[err.status];
        const msg = err.expose ? err.message : code;
        this.status = err.status;
        this.length = Buffer.byteLength(msg);
        this.res.end(msg);
    },
}
delegate(proto, 'response')
    .access('body')

delegate(proto, 'request')
    .access('method')
