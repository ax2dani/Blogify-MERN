const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Toggle follow/unfollow a user
// @route   POST /api/follow/:userId
// @access  Private
const toggleFollow = async (req, res) => {
    try {
        const targetId = req.params.userId;
        const currentUserId = req.user._id;

        if (targetId === currentUserId.toString()) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        const [currentUser, targetUser] = await Promise.all([
            User.findById(currentUserId),
            User.findById(targetId)
        ]);

        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        const isFollowing = currentUser.following.includes(targetId);

        if (isFollowing) {
            // Unfollow
            currentUser.following.pull(targetId);
            targetUser.followers.pull(currentUserId);
        } else {
            // Follow
            currentUser.following.addToSet(targetId);
            targetUser.followers.addToSet(currentUserId);
            
            // Create notification
            await Notification.create({
                recipient: targetId,
                sender: currentUserId,
                type: 'FOLLOW'
            });
        }

        await Promise.all([currentUser.save(), targetUser.save()]);

        res.json({ 
            following: !isFollowing,
            followerCount: targetUser.followers.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get follow status between current user and a target
// @route   GET /api/follow/:userId/status
// @access  Private
const getFollowStatus = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select('following');
        const following = currentUser.following.includes(req.params.userId);
        const target = await User.findById(req.params.userId).select('followers');
        res.json({ following, followerCount: target?.followers.length || 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { toggleFollow, getFollowStatus };
