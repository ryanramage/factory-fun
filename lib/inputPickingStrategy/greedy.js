var math = require('mathjs')

module.exports = (recipe, inputs, done) => {
  let usedInputs = {}
  let unableToAllocateEnough = false
  recipe.forEach(item => {
    let unit = item.unit || 'm' // work in meters. just picking a base of 1
    let needAmount = math.unit(item.amount, unit)
    let obtainedAmount = math.unit(0, unit)
    let input = inputs.find(input => input.product === item.product)
    usedInputs[item.product] = []

    for (var i = 0; i < input.queue.length; i++) {
      if (math.smaller(obtainedAmount, needAmount)) {
        let itemInQ = input.queue[i]
        usedInputs[item.product].push(input.queue.shift())
        let itemUnit = itemInQ.unit || 'm'
        let itemAmount = math.unit(itemInQ.amount, itemUnit)
        obtainedAmount = math.add(obtainedAmount, itemAmount)
      }
    }
    if (math.smaller(obtainedAmount, needAmount)) {
      unableToAllocateEnough = true
      usedInputs[item.product] = Error('not enough to start recipe')
    }
  })
  if (unableToAllocateEnough) return done(usedInputs)

  done(null, inputs, usedInputs)
}
