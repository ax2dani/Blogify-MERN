const Post = require('../models/Post');

// @desc    Fetch all PUBLISHED posts with pagination and search
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? { $text: { $search: req.query.keyword } }
            : {};
            
        const tagFilter = req.query.tag ? { tags: req.query.tag } : {};
        const filter = { ...keyword, ...tagFilter, status: { $ne: 'draft' } };

        const count = await Post.countDocuments(filter);
        const posts = await Post.find(filter)
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

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email avatar')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username avatar' }
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

// @desc    Create a post (published or draft)
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    const { title, content, tags, image, status } = req.body;
    try {
        const post = new Post({
            title,
            content,
            tags,
            image,
            author: req.user._id,
            status: status || 'published'
        });
        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user's drafts
// @route   GET /api/posts/my-drafts
// @access  Private
const getMyDrafts = async (req, res) => {
    try {
        const drafts = await Post.find({ author: req.user._id, status: 'draft' })
            .select('title createdAt updatedAt')
            .sort({ updatedAt: -1 });
        res.json(drafts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a post (also used to publish a draft)
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
    const { title, content, tags, image, status } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Not authorized to edit this post' });
            }
            post.title = title || post.title;
            post.content = content || post.content;
            post.tags = tags || post.tags;
            post.image = image !== undefined ? image : post.image;
            if (status) post.status = status;

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
        if (!post) return res.status(404).json({ message: 'Post not found' });
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
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const index = post.likes.indexOf(req.user._id);
        if (index === -1) {
            post.likes.push(req.user._id);
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
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recommended posts (same tags, exclude current)
// @route   GET /api/posts/:id/recommended
// @access  Public
const getRecommended = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).select('tags');
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const recommended = await Post.find({
            _id: { $ne: post._id },
            tags: { $in: post.tags },
            status: { $ne: 'draft' }
        })
            .select('title content author tags image likes createdAt')
            .populate('author', 'username avatar')
            .limit(3)
            .sort({ createdAt: -1 });

        res.json(recommended);
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
    toggleLike,
    getMyDrafts,
    getRecommended
};
