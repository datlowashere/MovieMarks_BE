const mongoose = require("mongoose");
require('dotenv').config();
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");
  } catch (error) {
    console.log("Failled" + error);
  }
}

module.exports = { connect };