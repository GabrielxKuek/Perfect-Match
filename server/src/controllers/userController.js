const userModel = require('../models/userModel');

const userController = {
    getUserProfile: async (req, res) => {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        try {
            const user = await userModel.getUserByUsername(username);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user: user
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving user profile'
            });
        }
    },

    getRandomUsers: async (req, res) => {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        try {
            // First, get the role_id of the requesting user
            const userRoleId = await userModel.getUserRoleId(username);

            if (!userRoleId) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            let targetRoleIds;
            switch (userRoleId) {
                case 1:
                    targetRoleIds = [2, 3]; // women see men and gabriel
                    break;
                case 2:
                case 3:
                    targetRoleIds = [1]; // men and gabriel see women
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid role ID'
                    });
            }

            // Pass both username and targetRoleIds to get random unmatched users
            const randomUsers = await userModel.getRandomUsersByRole(username, targetRoleIds);

            res.json({
                success: true,
                count: randomUsers.length,
                users: randomUsers
            });

        } catch (error) {
            console.error('Error in getRandomUsers:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving random users'
            });
        }
    },

    createMatch: async (req, res) => {
        const { username1, username2 } = req.body;
    
        // Validate input
        if (!username1 || !username2) {
            return res.status(400).json({
                success: false,
                message: 'Both usernames are required'
            });
        }
    
        // Prevent self-matching
        if (username1 === username2) {
            return res.status(400).json({
                success: false,
                message: 'Cannot create a match with yourself'
            });
        }
    
        try {
            const match = await userModel.createMatch(username1, username2);
            
            res.status(201).json({
                success: true,
                message: 'Match created successfully',
                match: match
            });
        } catch (error) {
            console.error('Error in createMatch:', error);
            
            // Handle specific error cases
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            
            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
    
            res.status(500).json({
                success: false,
                message: 'Error creating match'
            });
        }
    },

    uploadProfileImage: async (req, res) => {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        try {
            const updatedUser = await userModel.updateUserProfileImage(
                username,
                req.cloudinaryResult
            );

            res.json({
                success: true,
                message: 'Profile image updated successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error updating profile image:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating profile image'
            });
        }
    },

    deleteProfileImage: async (req, res) => {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        try {
            const updatedUser = await userModel.removeUserProfileImage(username);

            res.json({
                success: true,
                message: 'Profile image deleted successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error deleting profile image:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting profile image'
            });
        }
    },

    getGabrielProfiles: async (req, res) => {
        try {
            const profiles = await userModel.getRandomGabrielProfiles();
            
            res.json({
                success: true,
                count: profiles.length,
                profiles: profiles
            });
        } catch (error) {
            console.error('Error fetching Gabriel profiles:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving Gabriel profiles'
            });
        }
    }
};

module.exports = userController;