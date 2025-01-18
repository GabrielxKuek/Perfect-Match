const { PrismaClient } = require('@prisma/client');
const authenticationModel = require('../models/authenticationModel');
const prisma = new PrismaClient();

const authenticationController = {
    signup: (req, res) => {
        const { username, password, name, birthday, occupation, bio, role_id, gender } = req.body;
        
        // Basic input validation
        if (!username || !password || !name || !birthday || !role_id || !gender) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
    
        // Validate birthday
        const birthDate = new Date(birthday);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: 'Must be 18 or older to register'
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
                birthday: new Date(birthday), // Convert to Date object
                occupation: occupation || 'unemployed',
                bio: bio || '',
                role_id: parseInt(role_id) || 1,
                gender
            };
    
            authenticationModel.signup(userData, (error, result) => {
                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: error.message
                    });
                }
                res.status(201).json({
                    success: true,
                    message: 'User signed up successfully',
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