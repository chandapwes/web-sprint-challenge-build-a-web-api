// Write your "actions" router here!
const express = require('express');
const {
    validateActionId,
    validateAction,
} = require('./actions-middlware')

const Action = require('./actions-model')

const router = express.Router();

router.get('/', (req, res, next) => {
    Action.get()
        .then(actions => {
            res.json(actions)
        })
        .catch(next)
})

router.get('/:id', validateActionId, (req, res) => {
    res.json(req.action)
})

router.post('/', validateAction, (req, res, next) => {
    Action.insert({name: req.name})
        .then(newAction => {
            res.status(201).json(newAction)
        })
        .catch(next)
})

router.put('/:id', validateAction, validateActionId, (req, res, next) => {
    Action.update(req.params.id, { name: req.name })
        .then(() => {
            return Action.getById(req.params.id)
        })
        .then(action => {
            res.json(action)
        })
        .catch(next)
})

router.delete('/:id', validateActionId, async (req, res, next) => {
    try {
        await Action.remove(req.params.id)
        res.json(req.action)
    } catch (err) {
        next(err)
    }
})

router.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
        customMessage: 'something bad happened',
        message: err.message,
        stack: err.stack,
    })
})

module.exports = router