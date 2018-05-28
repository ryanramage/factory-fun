var factory = require('../lib/index')
var test = require('tape')

test('create a realestate factory', function (t) {
  let team = factory.init()
  let qualify = {
    label: 'qualify',
    recipe: [{ amount: 1, product: 'buyer' }],
    recipeProducts: [{ amount: 1, product: 'buyer.qualified' }],
    effortEstimate: [{ amount: 30, unit: 'minutes' }]
  }
  let accumulateListings = {
    label: 'accumulateListings',
    recipe: [{ amount: 1, product: 'buyer.qualified' }],
    recipeProducts: [{ amount: 1, product: 'showingTour' }],
    effortEstimate: [
      { amount: 3, unit: 'listings', notes: 'this is the number of listings favs accumlated before considering setup' },
      { amount: 20, unit: 'minutes', notes: 'this is the time to setup the showing' }]
  }
  let showing = {
    label: 'showing',
    recipe: [{ amount: 1, product: 'showingTour' }],
    recipeProducts: [{ amount: 3, product: 'completedShowing' }],
    effortEstimate: [
      { amount: 1, unit: 'hour', notes: 'based on three listings to see' },
      { amount: 50, unit: 'kilometers', notes: 'average driving' }
    ]
  }
  let offer = {
    label: 'offer',
    recipe: [{amount: 1, product: 'completedShowing'}],
    recipeProducts: [{ amount: 1, product: 'acceptedOffer' }],
    effortEstimate: [
      { amount: 3, unit: 'hours', notes: 'to negotiate and get signatures' }
    ]
  }

  team
    .addProcessingStep(qualify)
    .addProcessingStep(accumulateListings)
    .connectSteps('qualify', 'accumulateListings', [['buyer.qualified', 'buyer.qualified']])
    .addProcessingStep(showing)
    .connectSteps('accumulateListings', 'showing', [['showingTour', 'showingTour']])
    .addProcessingStep(offer)
    .connectSteps('showing', 'offer', [['completedShowing', 'completedShowing']])

  let realtor1 = {
    label: 'e12345'
  }

  team
    .addProccessingInstance('qualify', realtor1)
    .addProccessingInstance('accumulateListings', realtor1)
    .addProccessingInstance('showing', realtor1)
    .addProccessingInstance('offer', realtor1)

  let snobRealtor = { label: 'e1337' }
  team
    .addProccessingInstance('showing', snobRealtor)
    .addProccessingInstance('offer', snobRealtor)

  let asObject = team.serialize()
  console.log(JSON.stringify(asObject))
  t.end()
})

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

test('test recipe duplicated items throws exception', function (t) {
  let brokerage = factory.init()
  let qualify = {
    label: 'qualify',
    recipe: [{ amount: 1, product: 'buyer' }, { amount: 1, product: 'buyer' }],
    recipeProducts: [{ amount: 1, product: 'buyer.qualified' }],
    effortEstimate: [{ amount: 30, unit: 'minutes' }]
  }
  try {
    brokerage.addProcessingStep(qualify)
    t.fail()
  } catch (e) {
    t.ok(e)
    t.end()
  }
})

test('test recipeProducts duplicated items throws exception', function (t) {
  let team = factory.init()
  let qualify = {
    label: 'qualify',
    recipe: [{ amount: 1, product: 'buyer' }],
    recipeProducts: [{ amount: 1, product: 'buyer.qualified' }, { amount: 1, product: 'buyer.qualified' }],
    effortEstimate: [{ amount: 30, unit: 'minutes' }]
  }
  try {
    team.addProcessingStep(qualify)
    t.fail()
  } catch (e) {
    t.ok(e)
    t.end()
  }
})
