'use strict';
function compose(middleware) {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }

    return (ctx, next) => {
        let index = -1;
        const dispatch = (i) => {
            if (i < index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            const fn = middleware[i]
            if (!fn) return Promise.resolve()                
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
            } catch (err) {
                return Promise.reject(err);
            }

        }
        // need to return 
        return dispatch(0)

    }
}
module.exports = compose