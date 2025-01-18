const express = require("express");
const router = express.Router();

// define routes
const exampleRoute = require("./exampleRoute");
const authenticationRoute = require("./authenticationRoute");
const userRoute = require("./userRoute");

// use routes
router.use("/example", exampleRoute);
router.use("/auth", authenticationRoute);
router.use("/user", userRoute);

module.exports = router;
