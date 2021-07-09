// Write your "projects" router here!
const express = require('express');
const {
    validateProjectId,
    validateProject,
} = require('./projects-middleware')

const Project = require('./projects-model')

const router = express.Router();

router.get('/', (req, res, next) => {
    Project.get()
        .then(projects => {
            res.json(projects)
        })
        .catch(next)
})

router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.project)
})

router.post('/', validateProject, (req, res, next) => {
    Project.insert({name: req.name})
        .then(newProject => {
            res.status(201).json(newProject)
        })
        .catch(next)
})

router.put('/:id', validateProjectId, validateProject, (req, res, next) => {
    Project.update(req.params.id, { name: req.name })
        .then(() => {
            return Project.getById(req.params.id)
        })
        .then(project => {
            res.json(project)
        })
        .catch(next)
})

router.delete('/:id', validateProjectId, async (req, res, next) => {
    try {
        await Project.remove(req.params.id)
        res.json(req.project)
    } catch (err) {
        next(err)
    }
})

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    try {
        const result = await Project.getProjectActions(req.params.id)
        res.json(result)
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