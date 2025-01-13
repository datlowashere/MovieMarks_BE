const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    fullName: { type: String },
    username: { type: String },
    password: { type: String, required: true },
    accessToken: { type: String },
    avatar: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
