const { SystemError, UserAwarenessError, BaseError } = require("./base.error")

class ValidationError extends UserAwarenessError {
  constructor(errorMessage) {
    super("ValidationError", 400, errorMessage)
  }
}

class RequiredError extends BaseError {
  constructor(fields, got = undefined) {
    super(`RequiredError: fields ${fields} but got ${got}`)
    this.fields = fields
    this.got
  }
}
class EnvNotSetError extends SystemError {
  constructor(message) {
    super(`${message} EnvNotSetError`)
  }
}

class DoNothingError extends BaseError {
  constructor(errorCode, errorMessage) {
    super("DoNothingError", errorCode, errorMessage)
  }
}

exports.ValidationError = ValidationError
exports.RequiredError = RequiredError
exports.EnvNotSetError = EnvNotSetError
exports.DoNothingError = DoNothingError
