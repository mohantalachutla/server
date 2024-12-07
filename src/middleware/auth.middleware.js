const { ObjectId } = require("mongodb");
const {
  AnonymousError,
  UnauthorizedAccountError,
  InvalidAccountTokenError,
  AccountNotFoundError,
} = require("../error/account.error");
const { Account } = require("../model/account.model");
const { findAccount, findAccountById } = require("../service/account.service");
const { verifyAuthToken } = require("../util/auth.util");

// breaks the circuit if account not found
const canActivate = async (req, res, next) => {
  const { headers } = req;
  try {
    const token = headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedAccountError();
    }
    const accountId = verifyAuthToken(token);
    if (!accountId) {
      throw new UnauthorizedAccountError();
    }
    if (accountId) {
      let account = await findAccountById(accountId);
      if (!account || account == {}) {
        throw new UnauthorizedAccountError();
      }
      if (account && account != {}) {
        req.CURRENTUSERID = new String(account._id).valueOf();
        req.CURRENTUSERCRYPTOADDRESS = new String(
          account.cryptoAddress
        ).valueOf();
        next();
      }
    }
  } catch (err) {
    next(err);
  }
  return;
};

// won't break the circuit even if account not found
const extractLoginInfo = async (req, res, next) => {
  const { headers } = req;
  try {
    const token = headers?.authorization?.split(" ")[1];
    if (!token) throw new AnonymousError();
    const accountId = verifyAuthToken(token);
    if (!accountId) throw new InvalidAccountTokenError();
    let account = await findAccountById(accountId);
    req.CURRENTUSERID = account._id;
    req.CURRENTUSERCRYPTOADDRESS = account.cryptoAddress;
    next();
  } catch (err) {
    if (err instanceof AnonymousError) next();
    else next(err);
  }
  return;
};

exports.canActivate = canActivate;
exports.extractLoginInfo = extractLoginInfo;
