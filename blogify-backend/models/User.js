const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['USER', 'ADMIN', 'AUTHOR'],
            default: 'USER'
        },
        avatar: { type: String, default: '' },
        bio: { type: String, maxlength: 500, default: '' },
        gender: { 
            type: String, 
            enum: ['Male', 'Female', 'Other', 'Prefer not to say'], 
            default: 'Prefer not to say' 
        },
        interests: [{ type: String }],
        bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    { timestamps: true }
);

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
    // Generate token natively (20 random bytes)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token securely with SHA256 and store in db
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expiration to exactly 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
