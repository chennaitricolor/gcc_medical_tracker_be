const Joi = require('joi');
const { HEALTH_STATUS } = require('../constants');

module.exports = {
  getPersonsParam: Joi.object({
    id: Joi.number()
  }),
  getPersonsQuery: Joi.object({
    offset: Joi.number(),
    name: Joi.string(),
    gender: Joi.string().only('M', 'F'),
    age: Joi.number(),
    currentAddress: Joi.string(),
    permanentAddress: Joi.string(),
    healthStatus: Joi.string().only(HEALTH_STATUS)
  })
};
