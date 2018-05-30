const test = require('tape')
const setup = require('./utils/setup')
const fifo = require('../lib/queueSortStrategy/fifo')

test('create a realestate team', t => {
  let team = setup.createRealEstateTeam()
    .addInput(1, 'buyer', 'qualify', {contactId: 'normal1'}, 20000)
    .addInput(1, 'buyer', 'qualify', {contactId: 'tricky1'}, 10000, [{ amount: 2, unit: 'hours' }])

  team.startRecipe('qualify', {
    with: 'e12345',
    inputSortedBy: fifo
  }).then(processingId => {
    t.ok(processingId)

    t.end()
  }).catch(e => {
    t.fail(e)
  })

  // team.sortInputs('qualify', fifo, err => {
  //   t.error(err)
  //   let asObject = team.serialize()
  //   t.ok(asObject)
  //   console.log(JSON.stringify(asObject))
  //   t.end()
  // })
})
