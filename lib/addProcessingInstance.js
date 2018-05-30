const Joi = require('joi')
const _ = require('lodash')
const processingInstanceSchema = require('./schemas/processingInstance')

module.exports = (factory, graph, processingStepLabel, processingInstance) => {
  let node = graph.node(processingStepLabel)
  if (!node) throw Error(`Could not find node with processingStepLabel ${processingStepLabel}`)

  // clone this in case it is reused in other places
  let _processingInstance = _.cloneDeep(processingInstance)
  if (!_processingInstance.recipe) _processingInstance.recipe = node.processingStep.recipe
  if (!_processingInstance.recipeProducts) _processingInstance.recipeProducts = node.processingStep.recipeProducts
  if (!_processingInstance.effortEstimate) _processingInstance.effortEstimate = node.processingStep.effortEstimate

  let results = Joi.validate(_processingInstance, processingInstanceSchema)
  if (results.error) throw results.error

  node.processingStep.instances.push(_processingInstance)
  return factory
}
