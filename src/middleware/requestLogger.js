import { logger } from '../utils/logger.js'

export function getLogLevel (statusCode) {
    if ((statusCode) >= 500) return 'error'
    if ((statusCode) >= 400) return 'warn'
    return 'info'
}

export function requestLogger (req,res,next) {
    const start = Date.now()

    res.on('finish', () => {
        const responseTimeMs = Date.now() - start
        const logLevel = getLogLevel(res.statusCode)
    
        logger[logLevel]({
            reqId: req.reqId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            msg: res.locals.message,
            responseTimeMs
        })
    })

    next()
}