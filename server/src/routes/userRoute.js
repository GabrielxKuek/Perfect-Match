// INCLUDES
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ROUTES
router.get('/username/:username', userController.getUserProfile);

module.exports = router;