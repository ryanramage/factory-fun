module.exports = (factory, step, graph, node, amount, product, inputDetails, addedTimestamp, opts) => {
  let input = node.inputs.find(input => {
    if (input.product === product) return true
  })
  if (!input) throw Error(`Unable to find input ${product} for this processing step`)

  let effortEstimate = opts.effortEstimate || node.processingStep.effortEstimate
  let history = opts.history || []
  input.queue.push({ amount, inputDetails, history, addedTimestamp, effortEstimate })

  return step
}
