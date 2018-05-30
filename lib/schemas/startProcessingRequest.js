const Joi = require('joi')
const effort = require('./effort')

module.exports = Joi.object().keys({
  with: Joi.string().required().description('the label of the processingInstance to use'),
  effortEstimate: Joi.array().min(1).items(effort).description('an estimate of the effort needed to complete one finishedProduct'),
  inputSortedBy: Joi.func().arity(2).description('a function used to sort the processingStep Queue inputs before they are selected for the recipe'),
  inputPickedBy: Joi.func().description('a function used to pick the input from the processingStep Queue')
})
