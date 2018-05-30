module.exports = (factory, step, graph, node, processingId, unit, estimate) => {
  let status = node.processing[processingId]
  if (!status) throw Error(`Unable to find ${processingId} on this processing step`)
  let found = false
  status.estimate = status.estimate || []
  status.estimate.forEach(e => {
    if (found || e.unit !== unit) return
    e.amount = estimate
    found = true
  })
  if (!found) status.estimate.push({amout, estimate})
  return step
}
