const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Wrong file type. Only image files are allowed.');
        error.code = 'LIMIT_FILE_TYPES';
        return cb(error, false);
    }
    cb(null, true);
};

// Multer upload configuration (removed size limit as we handle it in middleware)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Middleware for handling Cloudinary operations
const cloudinaryMiddleware = {
    uploadImage: async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const { username } = req.params;
            if (!username) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is required'
                });
            }

            let buffer = req.file.buffer;
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB

            // Resize if needed
            if (buffer.length > MAX_SIZE) {
                console.log('Image exceeds 5MB, resizing...');
                
                const metadata = await sharp(buffer).metadata();
                
                // Calculate new dimensions while maintaining aspect ratio
                const scaleFactor = Math.sqrt(MAX_SIZE / buffer.length);
                const newWidth = Math.floor(metadata.width * scaleFactor);
                const newHeight = Math.floor(metadata.height * scaleFactor);

                // Resize image
                buffer = await sharp(buffer)
                    .resize(newWidth, newHeight, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: 80 })
                    .toBuffer();
            }

            // First, delete existing image if user has one
            const existingUser = await prisma.users.findUnique({
                where: { username },
                select: { profile_public_id: true }
            });

            if (existingUser?.profile_public_id) {
                await cloudinary.uploader.destroy(existingUser.profile_public_id);
            }

            // Convert buffer to base64
            const fileStr = buffer.toString('base64');
            const fileType = req.file.mimetype;

            // Upload to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(
                `data:${fileType};base64,${fileStr}`,
                {
                    folder: 'profile_pictures',
                    transformation: [
                        { width: 500, height: 500, crop: 'fill' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                }
            );

            req.cloudinaryResult = {
                url: uploadResponse.secure_url,
                public_id: uploadResponse.public_id
            };

            next();
        } catch (error) {
            console.error('Error in uploadImage middleware:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading image'
            });
        }
    },

    deleteImage: async (req, res, next) => {
        try {
            const { username } = req.params;
            
            const user = await prisma.users.findUnique({
                where: { username },
                select: { profile_public_id: true }
            });

            if (!user?.profile_public_id) {
                return res.status(400).json({
                    success: false,
                    message: 'No profile image found'
                });
            }

            const result = await cloudinary.uploader.destroy(user.profile_public_id);

            if (result.result === 'ok') {
                next();
            } else {
                throw new Error('Failed to delete image from Cloudinary');
            }
        } catch (error) {
            console.error('Error in deleteImage middleware:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting image'
            });
        }
    },

    // Utility function to extract public_id from Cloudinary URL
    extractPublicId: (cloudinaryUrl) => {
        try {
            const splitUrl = cloudinaryUrl.split('/');
            const publicIdWithExtension = splitUrl.slice(-1)[0];
            const publicId = publicIdWithExtension.split('.')[0];
            return `profile_pictures/${publicId}`;
        } catch (error) {
            console.error('Error extracting public_id:', error);
            return null;
        }
    },

    // Error handling middleware
    handleError: (err, req, res, next) => {
        if (err.code === 'LIMIT_FILE_TYPES') {
            return res.status(422).json({
                success: false,
                message: 'Invalid file type. Only images are allowed'
            });
        }

        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(422).json({
                success: false,
                message: 'File size too large'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Example usage in routes:
/*
router.post('/profile-image/:username',
    upload.single('image'),
    cloudinaryMiddleware.uploadImage,
    async (req, res) => {
        try {
            // Handle the successful upload, e.g., update database
            res.json({
                success: true,
                url: req.cloudinaryResult.url,
                public_id: req.cloudinaryResult.public_id
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.delete('/profile-image/:username',
    cloudinaryMiddleware.deleteImage,
    async (req, res) => {
        try {
            // Handle the successful deletion, e.g., update database
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);
*/

module.exports = {
    upload,
    cloudinaryMiddleware
};