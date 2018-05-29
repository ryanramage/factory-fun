const Joi = require('joi')

module.exports = Joi.object().keys({
  with: Joi.string().required().description('the label of the processingInstance to use'),
  inputSortedBy: Joi.optional().func().arity(2).description('a function used to sort the processingStep Queue inputs before they are selected for the recipe'),
  inputPickedBy: Joi.optional().func().description('a function used to pick the input from the processingStep Queue')
})
