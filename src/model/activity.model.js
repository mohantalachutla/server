const { model } = require("mongoose")
const { activitySchema } = require("./activity.schema")

exports.Activity = model("activity", activitySchema)
