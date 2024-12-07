const crypto = require("crypto")

const SECRETE_KEY = ""

const getCryptoAddress = () => {
  return crypto.randomUUID()
}

const signAuthToken = (accountId) => {
  return accountId
}
const verifyAuthToken = (token) => {
  console.debug({ token })
  return token
}

exports.getCryptoAddress = getCryptoAddress
exports.signAuthToken = signAuthToken
exports.verifyAuthToken = verifyAuthToken
