const Joi = require('joi')

module.exports = Joi.string().hostname() // we cheat here. We need a dot notation to support wood.birch.gradeA
