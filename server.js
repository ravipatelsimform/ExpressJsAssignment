require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const database = require("./db/Database");
const config = require("./config/config");
const { errorController } = require("./controllers");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");
const catchAsync = require("./utils/catchAsync");
const { tokenMessages } = require("./messages");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", routes);
app.use(express.static("public"));
app.use("/avatar", express.static(path.join(__dirname, "Assets", "Avatar")));
// error handler
app.all(
  "*",
  catchAsync(async (req, res) => {
    throw new ApiError(
      tokenMessages.error.PAGE_NOT_FOUND,
      httpStatus.NOT_FOUND
    );
  })
);
app.use(errorController);

const port = config.system.port;

database
  ._connect()
  .then(() => {
    console.log("DataBase Connected Successfully");
    app.listen(port, () => {
      console.log(`[SERVER][START]: http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(`[SERVER][ERROR]: `, err);
  });
