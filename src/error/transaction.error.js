const { BaseError } = require("./base.error")

class NotEnoughBalanceError extends BaseError {
  constructor() {
    super("NotEnoughBalanceError")
  }
}
class TransactionFailedError extends BaseError {
  constructor() {
    super("TransactionFailedError")
  }
}

exports.NotEnoughBalanceError = NotEnoughBalanceError
exports.TransactionFailedError = TransactionFailedError
