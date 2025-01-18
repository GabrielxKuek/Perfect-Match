const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const chatModel = {
    // Get all matches for a user
    getUserMatches: async (username) => {
        try {
            const matches = await prisma.matches.findMany({
                where: {
                    OR: [
                        { username_1: username },
                        { username_2: username }
                    ]
                },
                select: {
                    username_1: true,
                    username_2: true,
                    users_matches_username_1Tousers: {
                        select: {
                            username: true,
                            name: true,
                            profile_url: true,
                            role: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    users_matches_username_2Tousers: {
                        select: {
                            username: true,
                            name: true,
                            profile_url: true,
                            role: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            // Transform the data to make it easier to work with
            return matches.map(match => {
                const otherUser = match.username_1 === username 
                    ? match.users_matches_username_2Tousers 
                    : match.users_matches_username_1Tousers;
                
                return {
                    matchedUsername: otherUser.username,
                    name: otherUser.name,
                    profile_url: otherUser.profile_url,
                    role: otherUser.role.name
                };
            });
        } catch (error) {
            console.error('Error in getUserMatches:', error);
            throw new Error('Error fetching user matches');
        }
    },

    getMessagesAsGabriel: async () => {
        try {
            const messages = await prisma.message.findMany({
                where: {
                    AND: [
                        {
                            username_1: {
                                in: await prisma.users.findMany({
                                    where: { role_id: { not: 3 } },
                                    select: { username: true }
                                }).then(users => users.map(u => u.username))
                            }
                        },
                        {
                            username_2: {
                                in: await prisma.users.findMany({
                                    where: { role_id: { not: 3 } },
                                    select: { username: true }
                                }).then(users => users.map(u => u.username))
                            }
                        }
                    ]
                },
                select: {
                    message_id: true,
                    message: true,
                    timestamp: true,
                    username_sender: true,
                    username_1: true,
                    username_2: true,
                    users: {
                        select: {
                            name: true,
                            profile_url: true,
                            role_id: true
                        }
                    },
                    matches: {
                        select: {
                            users_matches_username_1Tousers: {
                                select: {
                                    username: true,
                                    name: true,
                                    profile_url: true
                                }
                            },
                            users_matches_username_2Tousers: {
                                select: {
                                    username: true,
                                    name: true,
                                    profile_url: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    timestamp: 'asc'
                }
            });
    
            return messages.map(msg => {
                const receiverInfo = msg.username_sender === msg.username_1
                    ? msg.matches.users_matches_username_2Tousers
                    : msg.matches.users_matches_username_1Tousers;
    
                return {
                    message_id: msg.message_id,
                    content: msg.message,
                    timestamp: msg.timestamp,
                    sender: {
                        username: msg.username_sender,
                        name: msg.users.name,
                        profile_url: msg.users.profile_url
                    },
                    receiver: {
                        username: receiverInfo.username,
                        name: receiverInfo.name,
                        profile_url: receiverInfo.profile_url
                    }
                };
            });
        } catch (error) {
            console.error('Error in getMessagesAsGabriel:', error);
            throw new Error('Error fetching messages');
        }
    },

    // Get all messages between two users
    getMessagesBetweenUsers: async (username1, username2) => {
        try {
            const messages = await prisma.message.findMany({
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
                },
                select: {
                    message_id: true,
                    message: true,
                    timestamp: true,
                    username_sender: true,
                    users: {  // Using 'users' relation
                        select: {
                            name: true,
                            profile_url: true
                        }
                    }
                },
                orderBy: {
                    timestamp: 'asc'
                }
            });
    
            // Transform the response to match your expected format
            return messages.map(msg => ({
                message_id: msg.message_id,
                content: msg.message,
                timestamp: msg.timestamp,
                sender: {
                    username: msg.username_sender,
                    name: msg.users.name,
                    profile_url: msg.users.profile_url
                }
            }));
        } catch (error) {
            console.error('Error in getMessagesBetweenUsers:', error);
            throw new Error('Error fetching messages');
        }
    },

    // Send a new message
    createMessage: async (senderUsername, receiverUsername, messageContent) => {
        try {
            // First verify the match exists
            const match = await prisma.matches.findFirst({
                where: {
                    OR: [
                        {
                            AND: [
                                { username_1: senderUsername },
                                { username_2: receiverUsername }
                            ]
                        },
                        {
                            AND: [
                                { username_1: receiverUsername },
                                { username_2: senderUsername }
                            ]
                        }
                    ]
                }
            });
    
            if (!match) {
                throw new Error('No match exists between these users');
            }
    
            // Create the message
            const message = await prisma.message.create({
                data: {
                    username_1: match.username_1,
                    username_2: match.username_2,
                    message: messageContent,
                    timestamp: new Date(),
                    username_sender: senderUsername
                },
                select: {
                    message_id: true,
                    message: true,
                    timestamp: true,
                    username_sender: true,
                    users: {  // Using 'users' relation here too
                        select: {
                            name: true,
                            profile_url: true
                        }
                    }
                }
            });
    
            // Return formatted message
            return {
                message_id: message.message_id,
                content: message.message,
                timestamp: message.timestamp,
                sender: {
                    username: message.username_sender,
                    name: message.users.name,
                    profile_url: message.users.profile_url
                }
            };
        } catch (error) {
            console.error('Error in createMessage:', error);
            throw new Error(`Error creating message: ${error.message}`);
        }
    },

    // Delete a message
    deleteMessage: async (messageId, username) => {
        try {
            // First verify the user is the sender of the message
            const message = await prisma.message.findUnique({
                where: { message_id: messageId },
                select: { username_sender: true }
            });

            if (!message) {
                throw new Error('Message not found');
            }

            if (message.username_sender !== username) {
                throw new Error('Unauthorized to delete this message');
            }

            // Delete the message
            await prisma.message.delete({
                where: { message_id: messageId }
            });

            return true;
        } catch (error) {
            console.error('Error in deleteMessage:', error);
            throw new Error(`Error deleting message: ${error.message}`);
        }
    }
};

// Handle cleanup when the application terminates
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

module.exports = chatModel;