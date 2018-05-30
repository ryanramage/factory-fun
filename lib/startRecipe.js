const Joi = require('joi')
const uuid = require('uuid')
const fifo = require('./queueSortStrategy/fifo')
const greedy = require('./inputPickingStrategy/greedy')
const startProcessingRequestSchema = require('./schemas/startProcessingRequest')

module.exports = (factory, graph, processingStepLabel, startProcessingRequest) => {
  return new Promise((resolve, reject) => {
    let node = graph.node(processingStepLabel)
    if (!node) return reject(Error(`Could not find node with processingStepLabel ${processingStepLabel}`))

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
        node.inputs = reducedInputs
        let processingId = uuid()

        node.processing[processingId] = {
          inputs: inProgress,
          complete: 0,
          estimate: startProcessingRequest.effortEstimate || node.processingStep.effortEstimate,
          processor: startProcessingRequest.with
        }
        resolve(processingId)
      })
    })
  })
}
