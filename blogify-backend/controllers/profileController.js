const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password -resetPasswordToken -resetPasswordExpire');
            
        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const posts = await Post.find({ author: user._id })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        const comments = await Comment.find({ author: user._id })
            .populate('post', 'title _id')
            .sort({ createdAt: -1 });

        res.json({
            user,
            posts,
            comments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { bio, gender, interests } = req.body;
        const updateData = {};
        
        if (bio !== undefined) updateData.bio = bio;
        if (gender !== undefined) updateData.gender = gender;
        if (interests !== undefined) {
            updateData.interests = Array.isArray(interests) 
                ? interests 
                : interests.split(',').map(i => i.trim()).filter(i => i.length > 0);
        }

        if (req.file) {
            updateData.avatar = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, updateProfile };
