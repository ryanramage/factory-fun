const Joi = require('joi')
const ingredient = require('./ingredient')
const effort = require('./effort')
const processingInstanceSchema = require('./processingInstance')

module.exports = Joi.object().keys({
  label: Joi.string().required().description('a unqiue label for this processing step'),
  recipe: Joi.array().min(1).items(ingredient).description('describe the things needed for this step'),
  recipeProducts: Joi.array().min(1).items(ingredient).required().description('what the recipe produces. amount can be an estimate'),
  effortEstimate: Joi.array().min(1).items(effort).description('an estimate of the effort needed to complete one finishedProduct'),
  effortEstimator: Joi.func().arity(1),
  instances: Joi.array().items(processingInstanceSchema)
})
