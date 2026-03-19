const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost, toggleLike } = require('../controllers/postController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/like').post(protect, toggleLike);

module.exports = router;
