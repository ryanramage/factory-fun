const graphlib = require('@dagrejs/graphlib')
const Graph = graphlib.Graph
// const sortFunctionSchema = require('./schemas/sortFunction')
const addProcessingStep = require('./addProcessingStep')
const connectSteps = require('./connectSteps')
const addProcessingInstance = require('./addProcessingInstance')
const addInput = require('./addInput')
const startRecipe = require('./startRecipe')
const recipeStatus = require('./recipeStatus')
const addEffort = require('./addEffort')
const reviseEstimate = require('./reviseEstimate')

exports.create = function () {
  let g = new Graph({directed: true})
  let factory = {}
  factory.addProcessingStep = addProcessingStep.bind(null, factory, g)
  factory.connectSteps = connectSteps.bind(null, factory, g)
  factory.addProcessingInstance = addProcessingInstance.bind(null, factory, g)
  factory.activity = {}

  factory.step = (processingStepLabel) => {
    let node = g.node(processingStepLabel)
    if (!node) throw Error(`Could not find node with processingStepLabel ${processingStepLabel}`)
    let step = {}
    step.addInput = addInput.bind(null, factory, step, g, node)
    step.start = startRecipe.bind(null, factory, step, g, node)
    step.status = recipeStatus.bind(null, factory, step, g, node)
    step.addEffort = addEffort.bind(null, factory, step, g, node)
    step.reviseEstimate = reviseEstimate.bind(null, factory, step, g, node)
    return step
  }

  factory.serialize = () => graphlib.json.write(g)
  return factory
}
