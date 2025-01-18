// INCLUDES
const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");

// ROUTES
// Public routes
router.post("/register", authenticationController.register);
router.post("/login", authenticationController.login);

// Protected routes
router.get("/profile", authenticationController.authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// Test route to verify token works
router.get("/test-auth", authenticationController.authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: "You have access to protected route",
        user: req.user
    });
});

module.exports = router;