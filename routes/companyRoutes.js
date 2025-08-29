const express = require('express');
const { createOrUpdate, me, all, one, update, remove } = require('../controllers/companyController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['company']), createOrUpdate);
router.get("/me", authMiddleware, roleMiddleware(["company"]), me);
router.get('/', authMiddleware, roleMiddleware(['admin']), all);
router.get('/:id', authMiddleware, one);
router.put("/", authMiddleware, roleMiddleware(["company"]), update); // company update
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), remove);

module.exports = router;
