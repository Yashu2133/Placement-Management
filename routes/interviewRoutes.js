const express = require('express');
const { create, all, one, update, remove } = require('../controllers/interviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, create);
router.get('/', authMiddleware, all);
router.get('/:id', authMiddleware, one);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
