const chatModel = require('../models/chatModel');

const chatController = {
    // Get all matches for a user
    getUserMatches: async (req, res) => {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        try {
            const matches = await chatModel.getUserMatches(username);
            
            res.json({
                success: true,
                count: matches.length,
                matches: matches
            });
        } catch (error) {
            console.error('Error fetching user matches:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving matches'
            });
        }
    },

    // Get conversation history between two users
    getConversation: async (req, res) => {
        const { username1, username2 } = req.params;

        if (!username1 || !username2) {
            return res.status(400).json({
                success: false,
                message: 'Both usernames are required'
            });
        }

        try {
            const messages = await chatModel.getMessagesBetweenUsers(username1, username2);
            
            res.json({
                success: true,
                count: messages.length,
                messages: messages
            });
        } catch (error) {
            console.error('Error fetching conversation:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving conversation'
            });
        }
    },

    // Send a new message
    sendMessage: async (req, res) => {
        const { senderUsername, receiverUsername, content } = req.body;

        // Validate required fields
        if (!senderUsername || !receiverUsername || !content) {
            return res.status(400).json({
                success: false,
                message: 'Sender username, receiver username, and message content are required'
            });
        }

        // Prevent sending message to self
        if (senderUsername === receiverUsername) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send message to yourself'
            });
        }

        try {
            const message = await chatModel.createMessage(
                senderUsername,
                receiverUsername,
                content
            );

            res.status(201).json({
                success: true,
                message: 'Message sent successfully',
                data: message
            });
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Handle specific error cases
            if (error.message.includes('No match exists')) {
                return res.status(403).json({
                    success: false,
                    message: 'Cannot send message: Users are not matched'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error sending message'
            });
        }
    },

    // Delete a message
    deleteMessage: async (req, res) => {
        const { messageId } = req.params;
        const { username } = req.body; // Assuming the username is sent in the request body

        if (!messageId || !username) {
            return res.status(400).json({
                success: false,
                message: 'Message ID and username are required'
            });
        }

        try {
            await chatModel.deleteMessage(parseInt(messageId), username);
            
            res.json({
                success: true,
                message: 'Message deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            
            if (error.message.includes('Message not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Message not found'
                });
            }

            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to delete this message'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error deleting message'
            });
        }
    }
};

module.exports = chatController;