const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const app_constants = require("../constants/app.json");
const jwt = require("jsonwebtoken");
const jwttt = "lkjdflsdj";

exports.userSignUp = async (data) => {
  const user_data = await User.findOne({ email: data.email });
  if (user_data) {
    return {
      success: 0,
      status: app_constants.BAD_REQUEST,
      message: "Email already exists",
      result: {},
    };
  }
  const salt = await bcrypt.genSalt(10);
  const hash_password = await bcrypt.hash(data.password, salt);

  const add_user = await User.create({ ...data, password: hash_password });
  //to send email

  return {
    success: 1,
    status: app_constants.SUCCESS,
    message: "user singUp successfully",
    result: add_user,
  };
};

exports.userLogIn = async (data) => {
  const { email, password } = data;
  const user_data = await User.findOne({ email });
  if (!user_data) {
    return {
      success: 0,
      status: app_constants.BAD_REQUEST,
      message: "Eamil does not exist",
      result: {},
    };
  }

  const password_check = await bcrypt.compare(password, user_data.password);

  if (!password_check) {
    return {
      success: 0,
      status: app_constants.BAD_REQUEST,
      message: "Invalid credentials",
      result: {},
    };
  }

  const token = await jwt.sign({ id: user_data.id }, jwttt);

  await User.updateOne({ _id: user_data._id }, { $set: { token } });
  return {
    success: 1,
    status: app_constants.SUCCESS,
    message: "user logged in successfully",
    result: { token },
  };
};

exports.updateProfile = async (data, user_data) => {
  const { username, fullname, bio } = data;
  const { id } = user_data;

  if (!user_data) {
    return {
      success: 0,
      status: app_constants.BAD_REQUEST,
      message: "User does not exist",
      result: {},
    };
  }

  const userName = username ? username : user_data.username;
  const fullName = fullname ? fullname : user_data.fullname;
  const Bio = bio ? bio : user_data.bio;

  const updatedUser = await User.updateOne(
    { _id: id },
    {
      username: userName,
      fullname: fullName,
      bio: Bio,
    }
  );

  if (!updatedUser) {
    return {
      success: 0,
      status: app_constants.BAD_REQUEST,
      message: "user dosen't update ",
      result: {},
    };
  }

  return {
    success: 1,
    status: app_constants.SUCCESS,
    message: "user updated successfully!",
    updatedUser,
  };
};

exports.logoutUser = async (data) => {
  const { _id } = data;

  const logout_user = await User.updateOne({ _id }, { $set: { token: "" } });

  if (logout_user) {
    return {
      success: 1,
      status: app_constants.SUCCESS,
      message: "user logout successfully",
      result: { logout_user },
    };
  }

  return {
    success: 0,
    status: app_constants.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
    result: {},
  };
};

exports.userProfile = async (data) => {
  const { id } = data;
  const user_data = await User.findOne(
    { _id: id },
    { _id: 0, __v: 0, password: 0 }
  );

  if (!user_data) {
    return {
      success: 0,
      status: app_constants.BAD_REQUEST,
      message: "User does not exist",
      result: {},
    };
  }

  return {
    success: 1,
    status: app_constants.SUCCESS,
    message: "user profile Page get successfully",
    result: user_data,
  };
};
