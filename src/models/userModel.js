const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, min: 6, max: 30 },
  fullname: { type: String, required: true, min: 6, max: 30 },
  email: { type: String, required: true, unique: true },
  token: { type: String, default: "" },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  profile_pic: { type: String },
  favorite: [{ type: Schema.ObjectId, ref: "user", default: [] }],
});

const User = model("user", UserSchema);
module.exports = User;
