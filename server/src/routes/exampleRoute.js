// INCLUDES
const express = require("express");
const router = express.Router();
const controller = require("../controllers/exampleController");

// CONTROLLERS
router.get("/test", controller.test);

module.exports = router;
