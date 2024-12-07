const { Schema } = require("mongoose");
const { ObjectId, Buffer } = Schema.Types;

const { Activity } = require("./activity.model");

/**
 * _id === account._id
 */
let accountSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  cryptoAddress: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "active",
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  displayName: {
    type: String,
  },
  displayPicture: {
    type: Buffer,
  },
  ssn: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

// creating virtual field to populate activites
accountSchema.virtual("activities", {
  ref: Activity, //model name as string or class
  localField: "_id",
  foreignField: "_account",
});

accountSchema.set("toObject", { virtuals: true });
accountSchema.set("toJSON", { virtuals: true });

exports.accountSchema = accountSchema;
