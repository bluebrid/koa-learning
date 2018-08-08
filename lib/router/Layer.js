const pathToRegExp = require('path-to-regexp')
class Layer {
    constructor(name, path, methods, middleware, opts) {
        this.name = name
        this.opts = opts
        this.path = path
        this.methods = methods
        this.stack = Array.isArray(middleware) ? middleware : [middleware]   
        this.regexp = pathToRegExp(path, this.paramNames, this.opts); 
    }
    setPrefix (prefix) {
        if(this.path) {
            this.path = prefix + this.path
            this.paramNames = [];
            this.regexp = pathToRegExp(this.path, this.paramNames, this.opts);
        } 
    }
    match (path) {
        return this.regexp.test(path);
    }
}
module.exports = Layer