const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createReport);
router.get('/', protect, getReports);
router.put('/:id', protect, updateReportStatus);

module.exports = router;
