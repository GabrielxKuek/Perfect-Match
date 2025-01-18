const express = require("express");
const router = express.Router();

// define routes
const exampleRoute = require("./exampleRoute");
const authenticationRoute = require("./authenticationRoute");

// use routes
router.use("/example", exampleRoute);
router.use("/auth", authenticationRoute);

module.exports = router;
