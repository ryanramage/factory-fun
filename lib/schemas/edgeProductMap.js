const Joi = require('joi')
const productMap = Joi.array().min(2).max(2).items(Joi.string())
module.exports = Joi.array().min(1).items(productMap)
