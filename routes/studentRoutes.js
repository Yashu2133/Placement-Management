const express = require('express');
const { create, all, update, remove, me, one } = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['student', 'admin']), create);
router.get('/', authMiddleware, roleMiddleware(['admin']), all);
router.get('/me', authMiddleware, me);
router.get('/:id', authMiddleware, one);
router.put('/:id', authMiddleware, roleMiddleware(['student', 'admin']), update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), remove);

module.exports = router;
