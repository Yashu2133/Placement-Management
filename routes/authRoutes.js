const express = require('express');
const { register, login, logout, profile, updateRole } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, profile);
router.put('/profile/role/:id', authMiddleware, updateRole);

module.exports = router;
