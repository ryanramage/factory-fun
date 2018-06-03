const factoryfun = require('../../lib/index')

exports.createRealEstateTeam = () => {
  let team = factoryfun.create()

  team.addProcessingStep({
    label: 'qualify',
    recipe: [{ amount: 1, product: 'buyer' }],
    recipeProducts: [{ amount: 1, product: 'buyer.qualified' }],
    effortEstimate: [{ amount: 30, unit: 'minutes' }]
  })

  team.addProcessingStep({
    label: 'accumulateListings',
    recipe: [{ amount: 1, product: 'buyer.qualified' }],
    recipeProducts: [{ amount: 1, product: 'showingTour' }],
    effortEstimate: [
      { amount: 3, unit: 'listings', notes: 'this is the number of listings favs accumlated before considering setup' },
      { amount: 20, unit: 'minutes', notes: 'this is the time to setup the showing' }]
  })

  team.addProcessingStep({
    label: 'showing',
    recipe: [{ amount: 1, product: 'showingTour' }],
    recipeProducts: [{ amount: 3, product: 'completedShowing' }],
    effortEstimate: [
      { amount: 1, unit: 'hour', notes: 'based on three listings to see' },
      { amount: 50, unit: 'kilometers', notes: 'average driving' }
    ]
  })

  team.addProcessingStep({
    label: 'offer',
    recipe: [{amount: 1, product: 'completedShowing'}],
    recipeProducts: [{ amount: 1, product: 'acceptedOffer' }],
    effortEstimate: [
      { amount: 3, unit: 'hours', notes: 'to negotiate and get signatures' }
    ]
  })

  // connect all the Processing Steps together, joining outputs with next stage inputs
  team
    .connectSteps('qualify', 'accumulateListings', 'buyer.qualified')
    .connectSteps('accumulateListings', 'showing', 'showingTour')
    .connectSteps('showing', 'offer', 'completedShowing')

  let realtor1 = { label: 'e12345' }
  team
    .addProcessingInstance('qualify', realtor1)
    .addProcessingInstance('accumulateListings', realtor1)
    .addProcessingInstance('showing', realtor1)
    .addProcessingInstance('offer', realtor1)

  let snobRealtor = { label: 'e1337' }
  team
    .addProcessingInstance('showing', snobRealtor)
    .addProcessingInstance('offer', snobRealtor)

  return team
}
