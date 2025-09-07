const express = require('express');
const { register, login, logout, profile, updateRole, getAllUsers, verifyPassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, profile);
router.get('/users', authMiddleware, getAllUsers);
router.post('/verify-password', authMiddleware, verifyPassword);
router.put('/role/:id', authMiddleware, updateRole);

module.exports = router;