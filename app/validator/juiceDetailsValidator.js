const Joi = require("joi");

const juiceDetailsSchema = Joi.object({
  juice_name: Joi.string().required(),
  quantity: Joi.string().required(),
  price: Joi.number().required(),
  juice_image: Joi.string(),
});

module.exports = juiceDetailsSchema;
