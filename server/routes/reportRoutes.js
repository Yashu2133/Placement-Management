const express = require('express');
const { generateForDrive, overallSummary } = require('../controllers/reportController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', authMiddleware, roleMiddleware(['admin']), overallSummary);
router.post('/drive/:driveId/generate', authMiddleware, roleMiddleware(['admin']), generateForDrive);

module.exports = router;
