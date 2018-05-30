module.exports = (factory, graph, amount, product, processingStepLabel, inputDetails, addedTimestamp, optionalEffortEstimate) => {
  let node = graph.node(processingStepLabel)
  if (!node) throw Error(`Could not find node with processingStepLabel ${processingStepLabel}`)

  let input = node.inputs.find(input => {
    if (input.product === product) return true
  })
  if (!input) throw Error(`Unable to find input ${product} for this processing step`)

  let effortEstimate = optionalEffortEstimate
  if (!effortEstimate) effortEstimate = node.processingStep.effortEstimate
  input.queue.push({ amount, inputDetails, addedTimestamp, effortEstimate })

  return factory
}
