// const jwtToken = "fjsdlkfjsld";
const app_constants = require("../constants/app.json");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const jwttt = "lkjdflsdj";
require("dotenv").config();

exports.verifyToken = async (req, res, next) => {
  //   console.log(req.headers);
  const { authorization } = req.headers;
  if (!authorization) {
    return res.json({
      success: 0,
      status: app_constants.UNAUTHORIZED,
      message: "Please pass the token",
      result: {},
    });
  }

  const token = authorization.replace("Bearer ", "");

  const verify_token = await jwt.verify(token, jwttt);

  if (!verify_token) {
    return res.json({
      success: 0,
      status: app_constants.UNAUTHORIZED,
      message: "Invalid token",
      result: {},
    });
  }

  const { id } = verify_token;

  const user_data = await User.findById(id);

  if (!user_data) {
    return res.json({
      success: 0,
      status: app_constants.UNAUTHORIZED,
      message: "user does not exist",
      result: {},
    });
  }

  if (token !== user_data.token) {
    return res.json({
      success: 0,
      status: app_constants.UNAUTHORIZED,
      message: "Invalid token!",
      result: {},
    });
  }

  // console.log("req.user", req.user);

  req.user = user_data;
  // console.log("now req.user", req.user);

  next();
};
