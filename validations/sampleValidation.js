const Joi = require('joi')

module.exports = {
  sampleData: Joi.object().keys({
    id: Joi.number().integer().min(0).max(65535).required(),
    firstName: Joi.string().trim().max(255),
    lastName: Joi.string().trim().max(255)
  }).unknown(false)
}
