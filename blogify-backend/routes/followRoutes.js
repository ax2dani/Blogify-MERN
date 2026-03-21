const express = require('express');
const router = express.Router();
const { toggleFollow, getFollowStatus } = require('../controllers/followController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/:userId', protect, toggleFollow);
router.get('/:userId/status', protect, getFollowStatus);

module.exports = router;
