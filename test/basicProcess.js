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

    let accumulateListings = team.step('accumulateListings')
    console.log(accumulateListings.queue[0].queue[0])
    accumulateListings.start({
      started: 41000,
      with: 'e12345',
      inputSortedBy: fifo
    }).then(processingId => {
      let products = accumulateListings.finish(processingId, 42000)
      t.ok(products)
      let showing = team.step('showing')
      showing.start({
        started: 43000,
        with: 'e1337'
      }).then(processingId => {
        let products = showing.finish(processingId)
        console.log(products)
        let offer = team.step('offer')
        offer.start({
          started: 43000,
          with: 'e1337'
        }).then(processingId => {
          let products = offer.finish(processingId)
          console.log(products.endProducts[0])
        })
      })
    })

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
