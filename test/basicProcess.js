const test = require('tape')
const setup = require('./utils/setup')
const fifo = require('../lib/queueSortStrategy/fifo')

test('create a realestate team', t => {
  let addedTimestamp = new Date().getTime()

  let team = setup.createRealEstateTeam()
    .addInput(1, 'buyer', 'qualify', {contactId: 'normal1'}, addedTimestamp)
    .addInput(1, 'buyer', 'qualify', {contactId: 'tricky1'}, addedTimestamp - 1000, [{ amount: 2, unit: 'hours' }])

  team.startProcessing('qualify', {
    with: 'e12345',
    inputSortedBy: fifo
  }, (err, processingID) => {
    t.error(err)
    t.ok(processingID)
    t.end()
  })

  // team.sortInputs('qualify', fifo, err => {
  //   t.error(err)
  //   let asObject = team.serialize()
  //   t.ok(asObject)
  //   console.log(JSON.stringify(asObject))
  //   t.end()
  // })
})
