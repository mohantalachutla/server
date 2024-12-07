const { Schema } = require("mongoose");
const { ObjectId } = require("mongodb");

/**
 * _id === activityId
 * _account === accountId
 */
let activitySchema = new Schema({
  _account: {
    type: ObjectId,
    required: true,
    ref: "Account",
  },
  activity: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  modelForRef: {
    type: String,
    required: true,
    enum: ["Job", "JobTodo", "Account", "Transaction", "Payment"],
  },
  _ref: {
    type: ObjectId,
    required: true,
    refPath: "modelForRef",
  },
  createdAt: {
    type: Date,
    default: global.Date.now(),
  },
  updatedAt: {
    type: Date,
    default: global.Date.now(),
  },
});

exports.activitySchema = activitySchema;
