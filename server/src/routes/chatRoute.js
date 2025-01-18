const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Get all messages for gabriel view
router.get('/messages/gabriel', chatController.getMessagesAsGabriel);

// Get all matches for a user
router.get('/matches/:username', chatController.getUserMatches);

// Get conversation history between two users
router.get('/conversation/:username1/:username2', chatController.getConversation);

// Send a new message
router.post('/message', chatController.sendMessage);

// Delete a message
router.delete('/message/:messageId', chatController.deleteMessage);

module.exports = router;