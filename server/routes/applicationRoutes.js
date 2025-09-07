const express = require('express');
const { create, my, company, all, one, updateStatus, remove } = require('../controllers/applicationController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['student']), upload.single('resumeFile'), (req, res, next) => {
  if (req.file) req.body.resume = `/uploads/${req.file.filename}`;
  next();
}, create);
router.get('/my', authMiddleware, roleMiddleware(['student']), my);
router.get('/company', authMiddleware, roleMiddleware(['company']), company);
router.get('/', authMiddleware, roleMiddleware(['admin']), all);
router.get('/:id', authMiddleware, one);
router.put('/:id/status', authMiddleware, roleMiddleware(['company','admin']), updateStatus);


module.exports = router;