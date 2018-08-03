const moment = require('moment')
class Logger {
    constructor(opts) {
        this.opts = opts || {}
    }
    log() {
        const handler = async (req, res, next) => {
            let prefix = `[${this.opts.name || 'SKoa-Logger'}]`
            let startTime = Date.now()
            console.log(`${prefix} Start Time:${moment(startTime).format('YYYY-MM-DD hh:mm:ss')}`)
            console.log(`${prefix} Requst URL:${req.url}`)
            try {
                await next()
            } catch (err) {
                console.error(`${prefix} Error Message:${err}`)
                throw err
            }
            let endTitme = Date.now()
            console.log(`${prefix} End Time:${moment(endTitme).format('YYYY-MM-DD hh:mm:ss')}`)
            console.log(`${prefix} Total Time:${endTitme - startTime}`)
        }
        return handler
    }
}
module.exports = Logger