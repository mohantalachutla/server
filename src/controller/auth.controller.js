const express = require("express");
const crypto = require("crypto");
const _ = require("lodash");

const { Account } = require("../model/account.model");
const { E } = require("../constants/error.constants");
const { Activity } = require("../model/activity.model");
const { ObjectId } = require("mongodb");
const { getCryptoAddress, signAuthToken } = require("../util/auth.util");
const {
  canActivate,
  extractLoginInfo,
} = require("../middleware/auth.middleware");
const {
  findAccountDetails,
  findAccount,
  createAccount,
  findAccountById,
  findAccountDetailsById,
} = require("../service/account.service");
const { createActivity } = require("../service/activity.service");
const { constants } = require("../constants/common.constants");
const {
  controllerTerminator,
} = require("../middleware/controllerTerminator.middleware");
const { BaseError } = require("../error/base.error");
const {
  AccountCreationError,
  AccountNotFoundError,
  AccountDetailsNotFoundError,
  InvalidAccountTokenError,
} = require("../error/account.error");
const { ApiResponse } = require("../model/common/ApiResponse");
const { registerValidator } = require("../validator/register.validator");
const { loginValidator } = require("../validator/login.validator");

const authRouter = express.Router();

/**
 * @requires email, password
 * @returns ApiResponse
 * @param email Email
 * @param cryptoAddress encrypted email
 * @description Creates an Account
 * @todo cryptoaddress should be encrypted *
 * token should be signed
 */
authRouter.post(
  "/register",
  async (req, res, next) => {
    const { fields } = req;

    try {
      let input = await registerValidator.validateAsync({
        email: fields.email,
        password: fields.password,
      });

      // make sure the email is unique
      try {
        await findAccount({ email: input.email });
        next(new ApiResponse({}, 400, "Sorry email is allready used"));
      } catch (e) {}

      let account = new Account({
        ...input,
        cryptoAddress: input.email, //encryptedmail
      });

      account = await createAccount(account);
      if (!account?._id) throw new AccountCreationError();

      // activity
      let activity = await createActivity({
        accountId: account._id.toString(),
        activityName: constants.ACTIVITY_ACCOUNT_CREATED,
        modelName: "Account",
        modelDocumentId: account._id,
        description: `Your account created ${account._id} at ${account.createdAt}`,
      });
      if (!activity?._id) throw new AccountCreationError();
      account = await findAccountDetailsById(account._id);
      // for instant login
      next(
        new ApiResponse(
          {
            ...account,
            token: signAuthToken(account._id), //getAuthToken(account._id) // encrypted uid
          },
          200,
          "Registration Successful"
        )
      );
    } catch (err) {
      if (err instanceof AccountCreationError)
        next(new ApiResponse({}, 400, "Registration failed"));
      next(err);
    }
    return;
  },
  controllerTerminator
);

/**
 * @param email Email
 * @requires email, password
 * @returns ApiResponse
 * @description Logsin an User
 * @todo cryptoaddress should be encrypted *
 * token signed
 */

authRouter.post(
  "/login",
  async (req, res, next) => {
    const { fields } = req;
    let account = {};

    try {
      // the three next line are for email validation (remove them if you wanna login with SYSTEM)
      let input = await loginValidator.validateAsync({
        email: fields.email,
        password: fields.password,
      });
      account =
        (await findAccount(
          { email: fields.email },
          { email: true, password: true } //"email + password"
        )) ?? // force included password, exclueded at schema level
        {};
      if (!account?._id)
        next(new ApiResponse({}, 400, "Incorret UserName or Password"));
      // the next line is for email validation (remove it if you wanna login with SYSTEM)
      if (account.password !== input.password)
        next(new ApiResponse({}, 400, "Incorret UserName or Password"));

      account = await findAccountDetailsById(account._id);
      next(
        new ApiResponse(
          {
            ...account,
            token: signAuthToken(account._id), //getAuthToken(account._id) // encrypted uid
          },
          200,
          "Login Successful"
        )
      );
    } catch (err) {
      next(err);
    }
  },
  controllerTerminator
);
authRouter.post(
  "/account",
  extractLoginInfo,
  async (req, res, next) => {
    const { CURRENTUSERID } = req;
    try {
      if (!CURRENTUSERID) throw new InvalidAccountTokenError();
      let account = await findAccountDetailsById(CURRENTUSERID);
      if (!account._id) throw new AccountDetailsNotFoundError();
      account = _.chain(account).omit("password").value();
      next({
        ...account,
        token: signAuthToken(account._id), //getAuthToken(account._id) // encrypted uid
      });
    } catch (err) {
      if (err instanceof InvalidAccountTokenError) {
        next({});
        return;
      }
      next(err);
    }
    return;
  },
  controllerTerminator
);

authRouter.get(
  "/account/wallet",
  extractLoginInfo,
  async (req, res, next) => {
    const { CURRENTUSERID, CURRENTUSERCRYPTOADDRESS } = req;
    // console.debug({ CURRENTUSERID, CURRENTUSERCRYPTOADDRESS })
    try {
      let account = await findAccountDetails({
        cryptoAddress: CURRENTUSERCRYPTOADDRESS,
        _id: CURRENTUSERID,
      });
      if (!account?.cryptoAddress) throw new AccountDetailsNotFoundError();
      account = _.chain(account).pick(["wallet", "cryptoAddress"]);
      next(account);
    } catch (err) {
      next(err);
    }
    return;
  },
  controllerTerminator
);

exports.authRouter = authRouter;
