const Joi = require('joi');

const validator = (schema, property) => (req, res, next) => {
  const { error } = Joi.validate(req[property], schema);
  if (!error) {
    next();
  } else {
    const { details = [] } = error;
    const message = details.map(i => i.message).join(',');
    res.status(400).json({ error: message });
  }
};
module.exports = validator;
