const Joi = require('joi')
const Graph = require('@dagrejs/graphlib').Graph
const processingStepsSchema = require('./schemas/processingStep')

exports.init = function () {
  let g = new Graph({directed: true})
  let factory = {}
  factory.addProcessingStep = _addProcessingStep.bind(null, factory, g)
  factory.connectSteps = _connectSteps.bind(null, factory, g)
  return factory
}

function _addProcessingStep (factory, graph, processingStep) {
  let results = Joi.validate(processingStep, processingStepsSchema)
  if (results.error) throw results.error
  if (graph.hasNode(processingStep.label)) throw Error('a node with the label already exists')
  graph.setNode(processingStep.label, processingStep)
  return factory // allow chaining
}

function _connectSteps (factory, graph, fromLabel, toLabel, ingredient) {
  return factory // allow chaining
}
