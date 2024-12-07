const { E } = require("../../constants/error.constants")
const { BaseError } = require("../../error/base.error")

/**
 * @requires @param {*} payload
 * @param {*} responseCode
 * @param {*} responseMessage
 * @param {*} responseCreatedAt
 * @throws ApiResponseError
 * @description
 * Format for express response
 */
class ApiResponse {
  constructor(payload, responseCode, responseMessage, responseCreatedAt) {
    if (!payload)
      throw new BaseError("ApiResponseError", 500, E.INTERNAL_SERVER)
    this.payload = payload
    this.responseCode = responseCode ?? 200
    this.responseMessage = responseMessage ?? ""
    this.responseCreatedAt = responseCreatedAt
      ? new Date(responseCreatedAt)
      : new Date()
  }
  setPayload(payload) {
    this.payload = payload
    return this
  }
  setResponseCode(responseCode) {
    this.responseCode = responseCode
    return this
  }
  setResponseMessage(responseMessage) {
    this.responseMessage = responseMessage
    return this
  }
  setResponseCreatedAt(responseCreatedAt) {
    this.responseCreatedAt = responseCreatedAt
    return this
  }
  toString() {
    return {
      payload: this.payload,
      responseCode: this.responseCode,
      responseMessage: this.responseMessage,
      responseCreatedAt: this.responseCreatedAt,
    }
  }
}

exports.ApiResponse = ApiResponse
