const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Toggle a post bookmark
// @route   POST /api/bookmarks/:postId
// @access  Private
const toggleBookmark = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const user = await User.findById(req.user._id);
        const isBookmarked = user.bookmarks.includes(post._id);

        if (isBookmarked) {
            // Un-bookmark
            user.bookmarks.pull(post._id);
            await user.save();
            return res.json({ message: 'Bookmark removed', bookmarked: false });
        } else {
            // Bookmark
            user.bookmarks.push(post._id);
            await user.save();
            return res.json({ message: 'Bookmark added', bookmarked: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookmarks for the logged in user
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
    try {
        // Find user and explicitly populate their bookmarks array
        const user = await User.findById(req.user._id).populate({
            path: 'bookmarks',
            select: 'title image tags createdAt author likes comments',
            populate: {
                path: 'author',
                select: 'username avatar'
            }
        });
        
        // Reverse so newest bookmarks are conceptually at the top (though native array push maintains insertion order naturally, we render as-is or reverse in frontend)
        res.json(user.bookmarks.reverse());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { toggleBookmark, getBookmarks };
