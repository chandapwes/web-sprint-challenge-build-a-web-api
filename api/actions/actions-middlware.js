// add middlewares here related to actions
const Action = require('./actions-model')

function logger(req, res, next) {
    const timestamp = new Date().toLocaleString()
    const method = req.method
    const url = req.originalUrl
    console.log(`[${timestamp}] ${method} to ${url}`)
    next()
}

function validateAction(req, res, next) {
    const { text } = req.body
    if (!text || !text.trim()) {
        res.status(400).json({
            message: 'missing required text field',
        })
    } else {
        req.text = text.trim()
        next()
    }
}

async function validateActionId(req, res, next) {
    try{
        const action = await Action.getById(req.params.id)
        if (!action) {
            next({ status: 404, message: 'action not found' })
        } else {
            req.action = action
            next()
        }
    } catch (err) {
        res.status(500).json({
            message: 'problem finding action',
        })
    }
}

module.exports = {
    logger,
    validateAction,
    validateActionId
}