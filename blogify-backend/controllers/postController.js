const Post = require('../models/Post');

// Get all posts with Pagination and N+1 query optimization (Populate)
const getPosts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const count = await Post.countDocuments();
        // .populate() here avoids N+1 database hits since mongoose aggregates the author references efficiently.
        const posts = await Post.find()
            .populate('author', 'username email')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

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

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Not authorized to delete this post' });
            }

            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
