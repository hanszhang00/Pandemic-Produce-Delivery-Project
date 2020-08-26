/**
 * @class
 * Library imports
 */
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

/**
 * Router imports
 */
const productRouter = require("./routes/products");
const paymentRouter = require("./routes/payment");
const checkoutRouter = require("./routes/checkout");
const utilRouter = require("./routes/util");

// Initialize the app and port
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  const config = require("dotenv").config();
}

/**
 * Connecting to Mongoose database
The reason why mongodb was not working was because of 
proccess.env

Specifically the default  variable NODE_ENV

which exist in all projects 
so when you deploy .env file is ignored

To test in the command line at root directory 
Type
 ```
 $export NODE_ENV=production

 ```
 you will see a mongoUri error when in production mode

 You could still use process.env.mongoUri however u would need to put it in heroku.com config

 */

const db = require("./config/key").mongoURI;

/*
For deployment of mongodb in heroku they have a config in 
*/

mongoose.connect(
  db,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, res) {
    if (err) {
      console.log("ERROR connecting to mongoDB", err);
    } else {
      console.log("Succeeded connecting to mongoDB!");
    }
  }
);

/**
 * Router for handling backend endpoint requests
 */

app.use("/api/products", productRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/util", utilRouter);

/**
 * Production dependency for frontend connection
 */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

/**
 * Finally listening to the port
 */
app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port " + port);
});
