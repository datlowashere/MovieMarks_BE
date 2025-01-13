const express = require("express");
const bodyParser = require("body-parser");
const db = require("./src/config/mongoosedb");
const route = require("./src/routers/index");
require("dotenv").config();

db.connect();

const app = express();

app.use(bodyParser.json());
route(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api-docs`);
});
