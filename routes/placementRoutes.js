const express = require('express');
const { create, all, one, update, remove } = require('../controllers/placementController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin']), create);
router.get('/', authMiddleware, all);
router.get('/:id', authMiddleware, one);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), remove);

module.exports = router;
