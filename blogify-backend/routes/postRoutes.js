const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost, toggleLike, getMyDrafts, getRecommended } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(getPosts).post(protect, createPost);
router.get('/my-drafts', protect, getMyDrafts);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/like').post(protect, toggleLike);
router.get('/:id/recommended', getRecommended);

module.exports = router;
