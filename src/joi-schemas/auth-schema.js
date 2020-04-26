const Joi = require('joi');
const joiPhoneNumber = require('joi-phone-number');

const phoneJoi = Joi.extend(joiPhoneNumber);

module.exports = {
  login: Joi.object({
    username: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true })
      .required(),
    password: Joi.string().required()
  }),
  changePassword: Joi.object({
    password: Joi.string().required()
  })
};
