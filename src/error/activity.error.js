const { BaseError } = require("./base.error")

 class ActivityCreationError extends BaseError {
   constructor() {
     super("AccountCreationError", 400, "Unable to register youuu!")
   }
 }

 exports.ActivityCreationError = ActivityCreationError
