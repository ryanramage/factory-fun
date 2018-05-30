const _ = require('lodash')
const Joi = require('joi')
const uuid = require('uuid')
const fifo = require('./queueSortStrategy/fifo')
const greedy = require('./inputPickingStrategy/greedy')
const startProcessingRequestSchema = require('./schemas/startProcessingRequest')

module.exports = (factory, step, graph, node, startProcessingRequest) => {
  return new Promise((resolve, reject) => {
    let results = Joi.validate(startProcessingRequest, startProcessingRequestSchema)
    if (results.error) return reject(results.error)

    let inputSortedBy = startProcessingRequest.inputSortedBy || fifo
    let inputPickedBy = startProcessingRequest.inputPickedBy || greedy

    // from here on, we need to prevent other startRecipe requests
    // to mess up picking ingredients that have been claimed.
    // suggestions include a startRecipe request queue that is done fifo

    inputSortedBy(node.inputs, (err, sortedInputs) => {
      if (err) return reject(err)

      inputPickedBy(node.processingStep.recipe, sortedInputs, (err, reducedInputs, inProgress) => {
        if (err) return reject(err)
        node.inputs = reducedInputs.map((inp, i) => {
          inp.index = i
          return inp
        })
        let processingId = uuid()
        let estimate = startProcessingRequest.effortEstimate || node.processingStep.effortEstimate || []
        let effort = estimate.map(est => {
          let eff = _.cloneDeep(est)
          eff.amount = 0
          return eff
        })

        node.processing[processingId] = {
          effort,
          estimate,
          started: startProcessingRequest.started,
          inputs: inProgress,
          processor: startProcessingRequest.with
        }
        resolve(processingId)
      })
    })
  })
}
