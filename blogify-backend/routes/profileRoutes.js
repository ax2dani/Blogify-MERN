const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

const router = express.Router();

router.route('/me').put(protect, upload.single('avatar'), updateProfile);
router.route('/:username').get(getProfile);

module.exports = router;
