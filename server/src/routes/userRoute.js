const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { upload, cloudinaryMiddleware } = require('../middlewares/cloudinaryMiddleware');

router.get('/username/:username', userController.getUserProfile);
router.get('/random/:username', userController.getRandomUsers);
router.post('/match', userController.createMatch);

router.post('/profile-image/:username', 
    upload.single('image'),
    cloudinaryMiddleware.uploadImage,
    userController.uploadProfileImage
);

router.delete('/profile-image/:username',
    cloudinaryMiddleware.deleteImage,
    userController.deleteProfileImage
);

module.exports = router;