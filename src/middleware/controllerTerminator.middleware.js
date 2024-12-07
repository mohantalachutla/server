const _ = require("lodash")
const { BaseError } = require("../error/base.error")
const { ApiResponse } = require("../model/common/ApiResponse")
const { RequiredError } = require("../error/common.error")

/**
 *
 * @param {*} out {}, [], "", ApiResponse, BaseError, Error
 * @param {*} req Express request
 * @param {*} res Express response
 * @param {*} next Express
 * @returns ApiResponse { payload, responseCode, responseMessage, responseCreatedAt}
 */

const controllerTerminator = (out, req, res, next) => {
  //logging result
  console.debug("controllerTerminator: out: \n")
  logResponse(out)

  //Success
  if (out instanceof ApiResponse) {
    res.status(200).send(out)
  }
  // required error
  else if (out instanceof RequiredError) {
    // check
    res.status(out.errorCode).send(
      new ApiResponse(
        {}, // empty incase of error
        out.errorCode,
        out.errorMessage
      )
    )
  }
  // expected error
  else if (out instanceof BaseError) {
    // check
    res.status(out.errorCode).send(
      new ApiResponse(
        {}, // empty incase of error
        out.errorCode,
        out.errorMessage
      )
    )
  }

  // unexpected error
  else if (out instanceof Error) {
    res
      .status(out.errorCode ?? 500)
      .send(new ApiResponse({}, 500, "Opps! Something went wrong CTMBITTT"))
  }
  // {}, Object, [], Array, Map, Set
  else if (
    _.isObject(out) || //not inherited
    _.isArray(out) ||
    _.isString(out) ||
    _.isMap(out) ||
    _.isSet(out)
  ) {
    res.status(200).send(
      new ApiResponse(
        out,
        200,
        "" // empty response message
      )
    )
  }
  // Ending req with 400
  else {
    console.debug("Ending req with 400")
    res.status(400).send({})
  }
}

/**
 * @description To log response to console or file
 * print size of any array and first row for simplicity
 */
const logResponse = (out) => {
  if (out instanceof Error) console.error(out.stack)
  // else if (out instanceof ApiResponse) console.debug(out.toString())
  // else if (out instanceof Array) {
  //   out.forEach((item) =>
  //     console.debug(_.omitBy(item, (v, k) => _.isEqual(k, "proofOfWork")))
  //   )
  // } else console.debug(out)
}

exports.controllerTerminator = controllerTerminator
