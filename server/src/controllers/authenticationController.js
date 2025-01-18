const { PrismaClient } = require('@prisma/client');
const authenticationModel = require('../models/authenticationModel');
const prisma = new PrismaClient();

const authenticationController = {
    register: (req, res) => {
        const { username, password, name, age, occupation, bio, role_id } = req.body;

        // Basic input validation
        if (!username || !password || !name || !age || !role_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if age is valid
        if (isNaN(age) || age < 18) {
            return res.status(400).json({
                success: false,
                message: 'Invalid age. Must be 18 or older'
            });
        }

        // First check if username exists
        authenticationModel.checkUsername(username, (checkError, exists) => {
            if (checkError) {
                return res.status(500).json({
                    success: false,
                    message: 'Error checking username availability'
                });
            }

            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Proceed with user creation
            const userData = {
                username,
                password,
                name,
                age: parseInt(age),
                occupation: occupation || 'unemployed',
                bio: bio || '',
                role_id: parseInt(role_id) || 1
            };

            authenticationModel.signup(userData, (error, result) => {
                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: error.message
                    });
                }

                // Store token in session storage
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    token: result.token,
                    user: result.user
                });
            });
        });
    },

    login: (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user by username
        prisma.users.findUnique({
            where: {
                username: username
            },
            include: {
                role: true
            }
        }).then(user => {
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }

            // Verify password
            authenticationModel.verifyPassword(password, user.password, (error, isMatch) => {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error verifying password'
                    });
                }

                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }

                // Generate token
                const token = authenticationModel.generateToken(user);

                res.json({
                    success: true,
                    message: 'Login successful',
                    token: token,
                    user: {
                        username: user.username,
                        name: user.name,
                        role: user.role.name
                    }
                });
            });
        }).catch(error => {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login'
            });
        });
    },

    // Middleware to verify JWT token
    authenticateToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required'
            });
        }

        const user = authenticationModel.verifyToken(token);
        
        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();
    }
};

module.exports = authenticationController;