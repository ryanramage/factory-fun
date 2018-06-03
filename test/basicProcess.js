const _ = require('lodash')
const test = require('tape')
const setup = require('./utils/setup')
const fifo = require('../lib/queueSortStrategy/fifo')

test('test stating,updating, and finishing a step', t => {
  let team = setup.createRealEstateTeam()
  let qualify = team.step('qualify')

  qualify.addInput(1, 'buyer', {contactId: 'normal1'}, 20000)
  qualify.addInput(1, 'buyer', {contactId: 'tricky1'}, 10000, [{ amount: 2, unit: 'hours' }])

  qualify.start({
    started: 30000,
    with: 'e12345',
    inputSortedBy: fifo
  }).then(processingId => {
    t.ok(processingId)

    let allStatus = qualify.status()
    t.ok(allStatus)

    let status = qualify.status(processingId)
    t.equals(_.get(status, 'effort[0].amount'), 0)
    t.equals(_.get(status, 'estimate[0].amount'), 30)
    qualify.addEffort(processingId, 'minutes', 20)
    qualify.reviseEstimate(processingId, 'minutes', 45)
    status = qualify.status(processingId)
    t.equals(_.get(status, 'effort[0].amount'), 20)
    t.equals(_.get(status, 'estimate[0].amount'), 45)

    let products = qualify.finish(processingId, 40000)
    console.log(JSON.stringify(products, null, 4))
    // qualify.finish(processingId, [{
    //   amount: 1,
    //   product: 'buyer.qualified'
    // }])
    t.end()
  }).catch(e => console.log(e))
})

test('No available inputs throws error', t => {
  let team = setup.createRealEstateTeam()
  team.step('qualify').start({
    started: 30000,
    with: 'e12345',
    inputSortedBy: fifo
  }).then(processingId => {
    t.fail()
  }).catch(e => {
    t.ok(e)
    t.end()
  })
})
