const { model } = require("mongoose")
const { accountSchema } = require("./account.schema")

exports.Account = model("account", accountSchema)
