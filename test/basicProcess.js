const test = require('tape')
const setup = require('./utils/setup')

test('create a realestate team', t => {
  let team = setup.createRealEstateTeam()
    .addInput(1, 'buyer', 'qualify', {contactId: 'normal1'})
    .addInput(1, 'buyer', 'qualify', {contactId: 'tricky1'}, [{ amount: 2, unit: 'hours' }])

  let asObject = team.serialize()
  t.ok(asObject)
  console.log(JSON.stringify(asObject))
  t.end()
})
