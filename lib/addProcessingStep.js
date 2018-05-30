const Joi = require('joi')
const processingStepsSchema = require('./schemas/processingStep')

module.exports = (factory, graph, processingStep) => {
  let results = Joi.validate(processingStep, processingStepsSchema)
  if (results.error) throw results.error
  if (graph.hasNode(processingStep.label)) throw Error(`a node with the label ${processingStep.label} already exists`)

  let uniqueIngredient = {}
  let inputs = processingStep.recipe.map((ingredient, i) => {
    if (uniqueIngredient[ingredient.product]) throw Error(`recipe items need to be unique. ${ingredient.product} duplicated`)
    uniqueIngredient[ingredient.product] = true
    return {
      index: i,
      product: ingredient.product,
      connected: false,
      queue: []
    }
  })

  let uniqueProduct = {}
  let outputs = processingStep.recipeProducts.map((ingredient, i) => {
    if (uniqueProduct[ingredient.product]) throw Error(`recipeProducts need to be unique. ${ingredient.product} duplicated`)
    uniqueProduct[ingredient.product] = true
    return {
      index: i,
      product: ingredient.product,
      connected: false
    }
  })

  if (!processingStep.instances) processingStep.instances = []

  graph.setNode(processingStep.label, {
    processingStep,
    inputs,
    outputs,
    processing: {}
  })
  return factory // allow chaining
}
