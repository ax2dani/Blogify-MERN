const express = require('express');
const { toggleBookmark, getBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getBookmarks);
router.route('/:postId').post(protect, toggleBookmark);

module.exports = router;
