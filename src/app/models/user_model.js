const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    fullName: {
      type: String,
      default: ""
    },
    username: { type: String },
    password: { type: String, required: true },
    accessToken: { type: String },
    avatar: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
