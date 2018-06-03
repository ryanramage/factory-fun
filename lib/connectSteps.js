
module.exports = (factory, graph, fromLabel, toLabel, product) => {
  let from = graph.node(fromLabel)
  if (!from) throw Error(`Could not find node with fromLabel ${fromLabel}`)
  let to = graph.node(toLabel)
  if (!to) throw Error(`Could not find node with toLabel ${toLabel}`)
  // connect the first product we can
  let outputToConnect = from.outputs.filter(output => !output.connected && output.product === product)

  if (!outputToConnect) throw Error(`no product ${product} to conmect on ${fromLabel}`)

  let inputToConnect = to.inputs.filter(input => !input.connected && input.product === product)
  if (!inputToConnect) throw Error(`no ${product} to connect on ${toLabel}`)

  outputToConnect.connected = true
  inputToConnect.connected = true

  graph.setEdge(fromLabel, toLabel, {product})
  return factory // allow chaining
}
