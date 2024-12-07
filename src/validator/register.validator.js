const joi = require('joi')
const { ValidationError } = require('../error/common.error')

const registerValidator = joi.object(
    {
        email: joi.string().required().email({ minDomainSegments: 2}).error(new ValidationError("Invalid email")),
        password: joi.string().required().error(new ValidationError("Invalid password"))
    }
)

exports.registerValidator = registerValidator