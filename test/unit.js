const test = require('tape')
const factoryfun = require('../lib/index')

test('throw exception if invalid data', t => {
  let brokerage = factoryfun.create()
  try {
    brokerage.addProcessingStep({ label: 'qualify' })
    t.fail()
  } catch (e) {
    t.ok(e)
    t.end()
  }
})

test('test recipe duplicated items throws exception', t => {
  let brokerage = factoryfun.create()
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

test('test recipeProducts duplicated items throws exception', t => {
  let team = factoryfun.create()
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
