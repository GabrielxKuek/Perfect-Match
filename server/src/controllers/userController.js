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
    }
};

module.exports = userController;