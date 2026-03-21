const Report = require('../models/Report');

// @desc    Submit a report on a post
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
    try {
        const { postId, reason, details } = req.body;
        const report = await Report.create({
            reporter: req.user._id,
            post: postId,
            reason,
            details: details || ''
        });
        res.status(201).json({ message: 'Report submitted. Thank you for keeping the community safe.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already reported this post.' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reports (admin only)
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Admin only' });
        const reports = await Report.find()
            .populate('reporter', 'username')
            .populate('post', 'title')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update report status (admin only)
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Admin only' });
        const report = await Report.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status },
            { new: true }
        );
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReport, getReports, updateReportStatus };
