const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    reason: { 
        type: String, 
        enum: ['Spam', 'Misinformation', 'Inappropriate Content', 'Harassment', 'Other'],
        required: true 
    },
    details: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'dismissed'], default: 'pending' }
}, { timestamps: true });

// Prevent duplicate reports from same user on same post
reportSchema.index({ reporter: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
