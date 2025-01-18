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
    }
};

// Handle cleanup when the application terminates
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

module.exports = userModel;