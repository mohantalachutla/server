const express = require('express')

const testRouter = express.Router()

testRouter.get('/',(req,res) => res.send('test okay'))
testRouter.post('/',(req,res) => {
    result = {
        body: req.body,
        param: req.params,
        query: req.query,
        fields: req.fields,
        files: req.files
    }
    res.status(200).send(result)
})
testRouter.delete('/:id',(req,res) => {
    result = {
        body: req.body,
        param: req.params,
        query: req.query,
        fields: req.fields,
        files: req.files
    }
    res.status(200).send(result)
})

exports.testRouter = testRouter