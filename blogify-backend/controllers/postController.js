const Post = require('../models/Post');

// @desc    Fetch all posts with pagination and search
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                  $text: { $search: req.query.keyword }
              }
            : {};
            
        const tagFilter = req.query.tag ? { tags: req.query.tag } : {};

        const count = await Post.countDocuments({ ...keyword, ...tagFilter });
        const posts = await Post.find({ ...keyword, ...tagFilter })
            .select('title content author tags image likes createdAt')
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ posts, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            });

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    const { title, content, tags, image } = req.body;

    try {
        const post = new Post({
            title,
            content,
            tags,
            image,
            author: req.user._id
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    const { title, content, tags, image } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            // Check if right user or admin
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Not authorized to edit this post' });
            }

            post.title = title || post.title;
            post.content = content || post.content;
            post.tags = tags || post.tags;
            post.image = image || post.image;

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Author or Admin)
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check user authorization
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle Like on a post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const index = post.likes.indexOf(req.user._id);
        if (index === -1) {
            // Not liked yet, add user ID
            post.likes.push(req.user._id);

            // Trigger Notification
            if (post.author.toString() !== req.user._id.toString()) {
                const Notification = require('../models/Notification');
                await Notification.create({
                    recipient: post.author,
                    sender: req.user._id,
                    type: 'LIKE',
                    post: post._id
                });
            }
        } else {
            // Already liked, remove user ID
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    toggleLike
};
