const express = require("express")

const { E } = require("../constants/error.constants")
const { ApiResponse } = require("../model/common/ApiResponse")

const activityRouter = express.Router()

activityRouter.get("", async (req, res, next) => {
  let apiResponse = new ApiResponse("activity get")

  next(apiResponse)
})

exports.activityRouter = activityRouter
