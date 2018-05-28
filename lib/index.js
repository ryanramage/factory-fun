const Joi = require('joi')
const graphlib = require('@dagrejs/graphlib')
const Graph = graphlib.Graph
const processingStepsSchema = require('./schemas/processingStep')
const edgeProductMapSchema = require('./schemas/edgeProductMap')

exports.init = function () {
  let g = new Graph({directed: true})
  let factory = {}
  factory.addProcessingStep = _addProcessingStep.bind(null, factory, g)
  factory.connectSteps = _connectSteps.bind(null, factory, g)
  factory.serialize = _serialize.bind(null, factory, g)
  return factory
}

function _addProcessingStep (factory, graph, processingStep) {
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
      connected: false
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

  graph.setNode(processingStep.label, {
    processingStep,
    inputs,
    outputs
  })
  return factory // allow chaining
}

function _connectSteps (factory, graph, fromLabel, toLabel, edgeProductMap) {
  let from = graph.node(fromLabel)
  if (!from) throw Error(`Could not find node with fromLabel ${fromLabel}`)
  let to = graph.node(toLabel)
  if (!to) throw Error(`Could not find node with toLabel ${toLabel}`)
  let results = Joi.validate(edgeProductMap, edgeProductMapSchema)
  if (results.error) throw results.error

  // // connect as many products as we can
  let unconnectedOutputs = {}
  from.outputs.filter(output => !output.connected).forEach(output => {
    unconnectedOutputs[output.product] = output
  })
  if (Object.keys(unconnectedOutputs).length === 0) throw Error(`all output products have been connected on ${fromLabel}`)

  let unconnectedInputs = {}
  to.inputs.filter(input => !input.connected).forEach(input => {
    unconnectedInputs[input.product] = input
  })
  if (Object.keys(unconnectedInputs).length === 0) throw Error(`all input products have been connected on ${toLabel}`)

  edgeProductMap.forEach(productMap => {
    let outputToConnect = unconnectedOutputs[productMap[0]]
    let inputToConnect = unconnectedInputs[productMap[1]]
    if (!outputToConnect) throw Error(`output product to connect ${productMap[0]} does not match an exisiting output`)
    if (outputToConnect.connected) throw Error(`output product to connect ${productMap[0]} is already connected`)
    if (!inputToConnect) throw Error(`input product to connect ${productMap[1]} does not match an existing input`)
    if (inputToConnect.connected) throw Error(`input product to connect ${productMap[0]} is already connected`)
    outputToConnect.connected = true
    inputToConnect.connected = true
  })

  graph.setEdge(fromLabel, toLabel, {})
  return factory // allow chaining
}

function _serialize (factory, graph) {
  return graphlib.json.write(graph)
}
