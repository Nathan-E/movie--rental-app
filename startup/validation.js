const Joi = require('joi');

export default function() {
  Joi.objectId = require('joi-objectid')(Joi);
}