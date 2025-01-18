// userModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userModel = {
    getUserByUsername: async (username) => {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    username: username
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
                            role_id: true,
                            name: true,
                            description: true
                        }
                    }
                }
            });
            return user;
        } catch (error) {
            throw new Error('Error fetching user data');
        }
    },

    getUserRoleId: async (username) => {
        try {
            const user = await prisma.users.findUnique({
                where: { username },
                select: { role_id: true }
            });
            return user ? user.role_id : null;
        } catch (error) {
            throw new Error('Error fetching user role');
        }
    },

    getRandomUsersByRole: async (username, excludedRoleIds) => {
        try {
            // Get 10 random users with specified role IDs who aren't already matched
            const randomUsers = await prisma.users.findMany({
                where: {
                    role_id: {
                        in: excludedRoleIds
                    },
                    // Exclude the requesting user
                    username: {
                        not: username
                    },
                    // Exclude users who already have a match with the requesting user
                    AND: [
                        {
                            NOT: {
                                matches_matches_username_1Tousers: {
                                    some: {
                                        username_2: username
                                    }
                                }
                            }
                        },
                        {
                            NOT: {
                                matches_matches_username_2Tousers: {
                                    some: {
                                        username_1: username
                                    }
                                }
                            }
                        }
                    ]
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
                            role_id: true,
                            name: true,
                            description: true
                        }
                    }
                },
                take: 10,
                orderBy: {
                    username: 'asc'
                }
            });

            if (randomUsers.length < 10) {
                console.warn(`Only found ${randomUsers.length} users matching criteria`);
            }

            return randomUsers;
        } catch (error) {
            console.error('Error in getRandomUsersByRole:', error);
            throw new Error('Error fetching random users');
        }
    },

    createMatch: async (username1, username2) => {
        try {
            // First verify both users exist
            const user1 = await prisma.users.findUnique({
                where: { username: username1 },
                select: { username: true }
            });
            
            const user2 = await prisma.users.findUnique({
                where: { username: username2 },
                select: { username: true }
            });
    
            if (!user1 || !user2) {
                throw new Error('One or both users not found');
            }
    
            // error is coming from here >:(

            // Check if match already exists (in either direction)
            const existingMatch = await prisma.matches.findFirst({
                where: {
                    OR: [
                        {
                            AND: [
                                { username_1: username1 },
                                { username_2: username2 }
                            ]
                        },
                        {
                            AND: [
                                { username_1: username2 },
                                { username_2: username1 }
                            ]
                        }
                    ]
                }
            });
    
            if (existingMatch) {
                throw new Error('Match already exists between these users');
            }
    
            // Create the new match
            const match = await prisma.matches.create({
                data: {
                    username_1: username1,
                    username_2: username2
                }
            });
    
            return match;
        } catch (error) {
            throw new Error(`Error creating match: ${error.message}`);
        }
    },

    updateUserProfileImage: async (username, imageData) => {
        try {
            const updatedUser = await prisma.users.update({
                where: {
                    username: username
                },
                data: {
                    profile_url: imageData.url,
                    profile_public_id: imageData.public_id
                },
                select: {
                    username: true,
                    profile_url: true,
                    profile_public_id: true
                }
            });
            return updatedUser;
        } catch (error) {
            console.error('Error in updateUserProfileImage:', error);
            throw new Error('Error updating user profile image');
        }
    },

    removeUserProfileImage: async (username) => {
        try {
            const updatedUser = await prisma.users.update({
                where: {
                    username: username
                },
                data: {
                    profile_url: null,
                    profile_public_id: null
                },
                select: {
                    username: true,
                    profile_url: true,
                    profile_public_id: true
                }
            });
            return updatedUser;
        } catch (error) {
            console.error('Error in removeUserProfileImage:', error);
            throw new Error('Error removing user profile image');
        }
    }
};

// Handle cleanup when the application terminates
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

module.exports = userModel;