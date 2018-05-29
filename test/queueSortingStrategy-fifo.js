const test = require('tape')
const fifo = require('../lib/queueSortStrategy/fifo')

test('fifo queue', t => {
  let inputs = [{
    product: 'wood',
    index: 0,
    queue: [
      { addedTimestamp: 10, amount: 10, inputDetails: {}, effortEstimate: [] },
      { addedTimestamp: 5, amount: 20, inputDetails: {}, effortEstimate: [] },
      { addedTimestamp: 7, amount: 3, inputDetails: {}, effortEstimate: [] }
    ]
  }]
  fifo(inputs, (err, result) => {
    t.error(err)
    t.ok(result)
    t.end()
  })
})
