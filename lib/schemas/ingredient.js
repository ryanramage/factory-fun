const Joi = require('joi')
const product = require('./product')

module.exports = Joi.object().keys({
  product: product.required().description('the ingredient item'),
  amount: Joi.number().required().description('how many are required for this step'),
  unit: Joi.string().description('optionally, what the unit of the amount are. See for valid')
})
