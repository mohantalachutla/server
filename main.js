//others
const dotEnvConfig = require("dotenv").config();
const dotenv_expand = require("dotenv-expand");
dotenv_expand(dotEnvConfig);
const express = require("express");
const cors = require("cors");
// const bodyParser = require('body-parser')
const eFormidable = require("express-formidable");
const eSession = require("express-session");
const morgan = require("morgan");
const packageJson = require("./package.json");

// core
const process = require("process");

//local
const { authRouter } = require("./src/controller/auth.controller");
const { activityRouter } = require("./src/controller/activity.controller");
const { testRouter } = require("./src/controller/test.controller");

const { db } = require("./src/config/mongoose.config");
const { RequiredError, EnvNotSetError } = require("./src/error/common.error");
const {
  controllerTerminator,
} = require("./src/middleware/controllerTerminator.middleware");
const { getSystemAccount } = require("./src/service/account.service");
const { SystemError } = require("./src/error/base.error");
const { getImageLocation } = require("./src/util/image.util");

const app = express();

corsOptions = {
  origin: ["http://localhost:4200", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

//middilewares
app.use(cors(corsOptions));
app.use(morgan("dev"));
// app.use(bodyParser())
app.use(
  eFormidable({
    encoding: "utf-8",
    multiples: true,
  })
);
app.use(
  eSession({ resave: false, saveUninitialized: true, secret: "itsasecret" })
);

/**
 * handles error and sends response
 */
app.use(controllerTerminator);

// routes
app.get("/", function (req, res) {
  res.status(201).send(`An ${packageJson.name} express server`);
});

app.use((req, res, next) => {
  const { fields, files, query, session, headers } = req;
  console.debug(">>>>>>>>>>>>>> New request <<<<<<<<<<");
  console.debug({ fields, files, query, session, headers });
  next();
});

app.use("/test", testRouter);
app.use("/auth", authRouter);
app.use("/activity", activityRouter);

//environment variables

if (
  !(
    process.env.HOST &&
    process.env.PORT &&
    process.env.MONGO_DB_URL &&
    getImageLocation()
  )
)
  throw new EnvNotSetError();

const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL;
let SYSTEM;

let notATopLevelAwait = async () => {
  const session = await db(MONGO_DB_URL);

  if (!session)
    throw new SystemError("DBSessionError", 500, "Db session not created");

  SYSTEM = await getSystemAccount();
  if (!SYSTEM?._id)
    throw new SystemError("SystemAccountError", 500, "System account required");

  // all set; start server
  app.listen(PORT, function () {
    console.info(`Server running at port : ${PORT}`);
  });
};
notATopLevelAwait();
