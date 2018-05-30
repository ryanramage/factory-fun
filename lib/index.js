const graphlib = require('@dagrejs/graphlib')
const Graph = graphlib.Graph
// const sortFunctionSchema = require('./schemas/sortFunction')
const addProcessingStep = require('./addProcessingStep')
const connectSteps = require('./connectSteps')
const addProcessingInstance = require('./addProcessingInstance')
const addInput = require('./addInput')
const startRecipe = require('./startRecipe')

exports.create = function () {
  let g = new Graph({directed: true})
  let factory = {}
  factory.addProcessingStep = addProcessingStep.bind(null, factory, g)
  factory.connectSteps = connectSteps.bind(null, factory, g)
  factory.addProcessingInstance = addProcessingInstance.bind(null, factory, g)
  factory.activity = {}
  factory.addInput = addInput.bind(null, factory, g)
  factory.startRecipe = startRecipe.bind(null, factory, g)
  factory.serialize = () => graphlib.json.write(g)
  return factory
}
