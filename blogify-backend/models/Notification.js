const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        type: {
            type: String,
            required: true,
            enum: ['LIKE', 'COMMENT']
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Post'
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
