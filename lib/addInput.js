module.exports = (factory, step, graph, node, amount, product, inputDetails, addedTimestamp, optionalEffortEstimate) => {
  let input = node.inputs.find(input => {
    if (input.product === product) return true
  })
  if (!input) throw Error(`Unable to find input ${product} for this processing step`)

  let effortEstimate = optionalEffortEstimate
  if (!effortEstimate) effortEstimate = node.processingStep.effortEstimate
  input.queue.push({ amount, inputDetails, addedTimestamp, effortEstimate })

  return step
}
