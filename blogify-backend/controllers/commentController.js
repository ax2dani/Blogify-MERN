const Comment = require('../models/Comment');
const Post = require('../models/Post');

const addComment = async (req, res) => {
    const { content, postId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            content,
            author: req.user._id,
            post: postId
        });

        // Add to post
        post.comments.push(comment._id);
        await post.save();

        // Trigger Notification
        if (post.author.toString() !== req.user._id.toString()) {
            const Notification = require('../models/Notification');
            await Notification.create({
                recipient: post.author,
                sender: req.user._id,
                type: 'COMMENT',
                post: post._id
            });
        }

        // Return comment with populated author for the frontend
        await comment.populate('author', 'username email');

        // Emit real-time WebSocket event to all clients viewing this post
        req.io.to(postId).emit('new_comment', comment);

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment) {
            const post = await Post.findById(comment.post);
            
            // Authorization Check: Comment Author OR Post Author OR Global Admin
            const isCommentAuthor = comment.author.toString() === req.user._id.toString();
            const isPostAuthor = post && post.author.toString() === req.user._id.toString();
            const isAdmin = req.user.role === 'ADMIN';

            if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to delete this comment' });
            }

            // Remove reference from post
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
