// INCLUDES
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ROUTES
// get user information
router.get('/username/:username', userController.getUserProfile);

// get random people for matches
router.get('/random/:username', userController.getRandomUsers);

// create match relation
router.post('/match', userController.createMatch);

module.exports = router;