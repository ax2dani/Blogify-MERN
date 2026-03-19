const express = require('express');
const { addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, addComment);

router.route('/:id')
    .delete(protect, deleteComment);

module.exports = router;
