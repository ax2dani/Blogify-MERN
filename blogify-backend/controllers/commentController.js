const Comment = require('../models/Comment');
const Post = require('../models/Post');

const addComment = async (req, res) => {
    const { content, postId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = new Comment({
            content,
            author: req.user._id,
            post: postId
        });

        const createdComment = await comment.save();

        post.comments.push(createdComment._id);
        await post.save();

        // Populate author to return back to frontend for immediate UI update
        await createdComment.populate('author', 'username');

        res.status(201).json(createdComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment) {
            if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Not authorized to delete this comment' });
            }

            // Remove reference from post
            const post = await Post.findById(comment.post);
            if (post) {
                post.comments = post.comments.filter(cId => cId.toString() !== comment._id.toString());
                await post.save();
            }

            await comment.deleteOne();
            res.json({ message: 'Comment removed' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addComment, deleteComment };
