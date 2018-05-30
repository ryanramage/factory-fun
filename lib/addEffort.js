module.exports = (factory, step, graph, node, processingId, unit, amount) => {
  let status = node.processing[processingId]
  if (!status) throw Error(`Unable to find ${processingId} on this processing step`)
  let found = false
  status.effort = status.effort || []
  status.effort.forEach(e => {
    if (found || e.unit !== unit) return
    e.amount += amount
    found = true
  })
  if (!found) status.effort.push({amout, unit}) // a new, unestimated effort
  //node.processing[processingId].status.effort = effort
  return step
}
