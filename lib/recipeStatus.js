const _ = require('lodash')

module.exports = (factory, step, graph, node, processingId) => {
  if (processingId) return _.cloneDeep(node.processing[processingId])
  else return _.cloneDeep(node.processing)
}
