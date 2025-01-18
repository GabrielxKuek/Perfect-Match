const express = require("express");
const router = express.Router();

// define routes
const exampleRoute = require("./exampleRoute");

// use routes
router.use("/example", exampleRoute);

module.exports = router;
