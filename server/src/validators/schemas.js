const Joi = require('joi');

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

const schemas = {
  register: Joi.object({
    name: Joi.string().min(20).max(60).required().messages({
      'string.min': 'Name must be at least 20 characters',
      'string.max': 'Name must be at most 60 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Must be a valid email address',
    }),
    password: Joi.string().pattern(passwordRegex).required().messages({
      'string.pattern.base':
        'Password must be 8–16 characters with at least one uppercase letter and one special character',
    }),
    address: Joi.string().max(400).optional().allow(''),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(passwordRegex).required().messages({
      'string.pattern.base':
        'Password must be 8–16 characters with at least one uppercase letter and one special character',
    }),
  }),

  addUser: Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex).required().messages({
      'string.pattern.base':
        'Password must be 8–16 characters with at least one uppercase letter and one special character',
    }),
    address: Joi.string().max(400).optional().allow(''),
    role: Joi.string().valid('admin', 'user', 'store_owner').required(),
  }),

  addStore: Joi.object({
    name: Joi.string().min(20).max(60).required().messages({
      'string.min': 'Store name must be at least 20 characters',
      'string.max': 'Store name must be at most 60 characters',
    }),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).optional().allow(''),
    owner_id: Joi.number().integer().positive().optional().allow(null),
  }),

  submitRating: Joi.object({
    store_id: Joi.number().integer().positive().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
  }),

  updateRating: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
  }),
};

/**
 * Middleware factory: validates req.body against a named schema.
 */
const validate = (schemaName) => (req, res, next) => {
  const schema = schemas[schemaName];
  if (!schema) return next();

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).json({ success: false, message: 'Validation failed', errors });
  }
  next();
};

module.exports = validate;
