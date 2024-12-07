/**
 * @requires @param {*} name
 * @param {*} errorcode
 * @param {*} errorMessage
 * @description
 * System Defined error
 * Should be logged to system log
 */
class BaseError extends Error {
  constructor(name, errorCode, errorMessage) {
    super(name)
    this.errorCode = errorCode ?? 400
    this.errorMessage = errorMessage ?? ""
  }
  setErrorCode(errorCode) {
    this.errorCode = errorCode ?? 400
    return this
  }
  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage ?? ""
    return this
  }
}

/**
 * Error: UserAwarenessError
 * Can be displayed to user
 * http code : 400
 */
class UserAwarenessError extends BaseError {
  constructor(name, errorCode, errorMessage) {
    super(name, errorCode, errorMessage)
  }
}

/**
 * Should not be displayed to user
 * http code : 500
 */
class SystemError extends BaseError {
  constructor(name, errorCode, errorMessage) {
    super(name, errorCode, errorMessage)
  }
}

/**
 * Not a error
 * Should not be logged to system log
 * i.e. data not found
 */
class NotAnError extends Error {
  constructor(name) {
    super(name)
  }
}

exports.BaseError = BaseError
exports.UserAwarenessError = UserAwarenessError
exports.SystemError = SystemError
exports.NotAnError = NotAnError
