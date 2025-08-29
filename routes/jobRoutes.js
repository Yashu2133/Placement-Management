const express = require('express');
const { create, all, one, update, remove, approve, reject } = require('../controllers/jobController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['company']), create); // company only
router.put("/approve/:id", authMiddleware, roleMiddleware(["admin"]), approve);
router.put("/reject/:id", authMiddleware, roleMiddleware(["admin"]), reject);
router.get('/', authMiddleware, all); // all roles
router.get('/:id', authMiddleware, one);
router.put('/:id', authMiddleware, roleMiddleware(['company']), update); // only company updates own jobs
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), remove);

module.exports = router;
