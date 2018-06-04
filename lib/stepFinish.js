const _ = require('lodash')

module.exports = (factory, step, graph, node, processingStepLabel, processingId, finished) => {
  let status = node.processing[processingId]
  if (!status) throw Error(`Unable to find ${processingId} on this processing step`)
  status.finished = finished || Date.now()
  delete node.processing[processingId]

  // push the current status into the history
  let history = status.history || []
  delete status.history
  history.push(status)
  console.log(history)

  let produces = _.cloneDeep(node.processingStep.recipeProducts)
  const edges = graph.nodeEdges(processingStepLabel)

  let results = { endProducts: [], nextStage: [] }

  produces.forEach(produce => {
    let found = false
    edges.forEach(edge => {
      let info = graph.edge(edge)
      if (info.product !== produce.product) return
      found = true
      let destinationNode = factory.step(edge.w)
      destinationNode.addInput(produce.amount, produce.product, {history}, finished)
      results.nextStage.push({to: edge.w, input: produce})
    })
    if (!found) results.endProducts.push({output: produce, history})
  })
  return results
}
