const { BaseError, UserAwarenessError } = require("./base.error")

class AccountCreationError extends UserAwarenessError {
  constructor() {
    super("AccountCreationError", 400, "Unable to register you!")
  }
}
class AccountNotFoundError extends UserAwarenessError {
  constructor() {
    super("AccountNotFoundError", 400, "Incorrect email or password")
  }
}
class AccountDetailsNotFoundError extends UserAwarenessError {
  constructor() {
    super(
      "AccountDetailsNotFoundError",
      400,
      "Opps! Unable to fetch your account"
    )
  }
}
class AnonymousError extends UserAwarenessError {
  constructor() {
    super("AnonymousError", 200, "Anonymous access")
  }
}
class InvalidAccountTokenError extends UserAwarenessError {
  constructor() {
    super(
      "InvalidAccountTokenError",
      400,
      "You token has expired or incorrect. Please login again."
    )
  }
}
class UnauthorizedAccountError extends UserAwarenessError {
  constructor() {
    super("UnauthorizedAccountError", 401, "Unauthorized access. Please login!")
  }
}

exports.AccountCreationError = AccountCreationError
exports.AccountNotFoundError = AccountNotFoundError
exports.AccountDetailsNotFoundError = AccountDetailsNotFoundError
exports.AnonymousError = AnonymousError
exports.InvalidAccountTokenError = InvalidAccountTokenError
exports.UnauthorizedAccountError = UnauthorizedAccountError
