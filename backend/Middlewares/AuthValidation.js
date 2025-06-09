const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        superkey: Joi.string().min(3).max(20).optional().allow('').empty(''),
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        superkey: Joi.string().optional().allow('').empty(''),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}

const authenticatedSubmitValidation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    reading: Joi.number().required(),
     date: Joi.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .label("date")
      .messages({
        'string.pattern.base': `"date" must be in YYYY-MM-DD format`
      })
  });
  const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation,
    authenticatedSubmitValidation,
}