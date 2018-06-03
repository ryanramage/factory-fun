const _ = require('lodash')

module.exports = (factory, step, graph, node, processingId, finished) => {
  let status = node.processing[processingId]
  if (!status) throw Error(`Unable to find ${processingId} on this processing step`)
  status.finished = finished || Date.now()
  delete node.processing[processingId]
  let products = _.cloneDeep(node.processingStep.recipeProducts)
  console.log(node.outputs)
  return { products, status }
}
