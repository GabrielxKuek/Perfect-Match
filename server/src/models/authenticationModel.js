require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a single instance of PrismaClient to be reused
const prisma = new PrismaClient();

// Get configuration from environment variables
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
const SECRET_KEY = process.env.BCRYPT_SECRET_KEY || 'pokemon123';
const JWT_SECRET = process.env.JWT_SECRET || 'pokemon123';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

const authenticationModel = {
    signup: (userData, callback) => {
        let profile_url = "";
        let profile_public_id = "";

        // Input validation
        if (!userData.username || !userData.password || !userData.name || !userData.birthday || !userData.role_id) {
            return callback(new Error('Missing required fields'), null);
        }
        
        const passwordWithSecret = `${userData.password}${SECRET_KEY}`;

        if (userData.role_id == 1) {
            profile_url = "https://res.cloudinary.com/dfgmojcfu/image/upload/v1737224291/profile_pictures/sbd0gzcvalssmjv2i22n.png"
            profile_public_id = "profile_pictures/sbd0gzcvalssmjv2i22n"
        } else if (userData.role_id == 2 || userData.role_id == 3) {
            profile_url = "https://res.cloudinary.com/dfgmojcfu/image/upload/v1737225099/profile_pictures/jdagkntghimvezvvtshr.png"
            profile_public_id = "profile_pictures/jdagkntghimvezvvtshr"
        } else {
            throw new Error('Invalid role ID');
        }
        
        bcrypt.hash(passwordWithSecret, SALT_ROUNDS, async (hashError, hashedPassword) => {
            if (hashError) {
                return callback(hashError, null);
            }
            
            try {
                const user = await prisma.users.create({
                    data: {
                        username: userData.username,
                        password: hashedPassword,
                        name: userData.name,
                        birthday: userData.birthday,
                        occupation: userData.occupation || "unemployed",
                        bio: userData.bio || '',
                        role_id: userData.role_id,
                        profile_url: profile_url,
                        profile_public_id: profile_public_id
                    },
                    select: {
                        username: true,
                        name: true,
                        birthday: true,
                        occupation: true,
                        bio: true,
                        profile_url: true,
                        profile_public_id: true,
                        role: {
                            select: {
                                name: true
                            }
                        }
                    }
                });
                
                const token = jwt.sign(
                    {
                        userId: user.username,
                        role: user.role.name
                    },
                    JWT_SECRET,
                    { expiresIn: JWT_EXPIRY }
                );
                
                callback(null, {
                    success: true,
                    user: user,
                    token: token
                });
            } catch (error) {
                if (error.code === 'P2002') {
                    callback(new Error('Username already exists'), null);
                } else {
                    console.log(error)
                    callback(new Error('Failed to create user'), null);
                }
            }
        });
    },

    verifyPassword: (password, hashedPassword, callback) => {
        const passwordWithSecret = `${password}${SECRET_KEY}`;
        bcrypt.compare(passwordWithSecret, hashedPassword, (error, isMatch) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, isMatch);
        });
    },

    generateToken: (user) => {
        return jwt.sign(
            { 
                userId: user.username,
                role: user.role.name 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    },

    checkUsername: async (username, callback) => {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    username
                }
            });
            console.log("Query succeeded. User:", user);
            callback(null, !!user);
        } catch (error) {
            console.error("Database query error:", error); // Log the real issue
            callback(error, null);
        }
    }
};

// Handle cleanup when the application terminates
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

module.exports = authenticationModel;