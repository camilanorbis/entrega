export function successResponse(res, { statusCode = 200, message, payload }) {
    res.locals.message = message
    return res.status(statusCode).json({
        status: 'success',
        message,
        payload
    })
}

export function errorResponse(res, { statusCode = 500, message = null }) {
    res.locals.message = message
    return res.status(statusCode).json({
        status: 'error',
        message: message || 'Internal server error'
    })
}