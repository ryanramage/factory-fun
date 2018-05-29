const compare = (a, b) => {
  let aTime = a.addedTimestamp || 0
  let bTime = b.addedTimestamp || 0
  return aTime - bTime
}

module.exports = (inputs, done) => {
  let sorted = inputs.map(input => {
    input.queue.sort(compare)
    return input
  })
  return done(null, sorted)
}
