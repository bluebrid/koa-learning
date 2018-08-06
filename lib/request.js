const only = require('only');
/**
 * 1,该对象只是对request 请求的req 进行一次mapping, 所以只要定义一个简单的对象即可
 * 2，利用Es6 的getter 和setter 进行属性的操作,
 * 3, 到目前为止，我们只用了request 的url 和 method , 所以我们先处理这两个属性
 */
module.exports = {
    get header() {
        return this.req.header;
    },
    set heaser(val) {
        this.req.header = val
    },
    get headers() {
        return this.req.headers;
    },
    set headers(val) {
        this.req.headers = val;
    },
    get url() {
        return this.req.url;
    },
    set url(val) {
        this.req.url = val;
    },
    get method() {
        return this.req.method;
    },
    set method(val) {
        this.req.method = val;
    }
}