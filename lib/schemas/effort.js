const Joi = require('joi')

module.exports = Joi.object().keys({
  amount: Joi.number().required(),
  unit: Joi.string().required().description(`the type of effort applied See http://mathjs.org/docs/datatypes/units.html#units for valid`)
})
