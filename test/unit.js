var factory = require('../lib/index')
var test = require('tape')

test('throw exception if invalid data', function (t) {
  let brokerage = factory.init()
  try {
    brokerage.addProcessingStep({ label: 'qualify' })
    t.fail()
  } catch (e) {
    t.ok(e)
    t.end()
  }
})

test('create a factory', function (t) {
  let brokerage = factory.init()
  let qualify = {
    label: 'qualify',
    recipe: [{ amount: 1, product: 'buyer' }],
    recipeProducts: [{ amount: 1, product: 'buyer.qualified' }],
    effortEstimate: [{ amount: 30, unit: 'minutes' }]
  }
  let listingReview = {
    label: 'listingReview',
    recipe: [{ amount: 1, product: 'buyer.qualified' }],
    recipeProducts: [{ amount: 1, product: 'buyer.qualified' }],
    effortEstimate: [{ amount: 20, unit: 'minutes' }]
  }
  brokerage
    .addProcessingStep(qualify)
    .addProcessingStep(listingReview)
    .connectSteps('qualify', 'listingReview', 'buyer.qualified')
  t.end()
})
