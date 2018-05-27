const Joi = require('joi')
const ingredient = require('./ingredient')
const effort = require('./effort')

module.exports = Joi.object().keys({
  label: Joi.string().required().description('a unqiue label for this processing instance'),
  recipe: Joi.array().items(ingredient).description('describe the things needed for this step'),
  recipeProducts: Joi.array().items(ingredient).required().description('what the recipe produces. amount can be an estimate'),
  effortEstimate: Joi.array().items(effort).description('an estimate of the effort needed to complete one finishedProduct'),
  batchMode: Joi.boolean().description('if true, recipies cant be started until the current batch is complete'),
  min: Joi.number().positive().integer().description('min number of recipies that can be run at once'),
  max: Joi.number().positive().integer().description('max number of recipies that can be run at once')
})
