const express = require('express');
const router = express.Router();

const controllers = require('../controllers/user.controllers');
const { authMiddleware } = require('../middlewares/user.auth');

// Add a new user (register)
router.post('/add', controllers.addUser);

// Login -> returns token + basic user
router.post('/login', controllers.login);

// Verify token and return basic user info
router.get('/verify', authMiddleware, controllers.verify);

// Get basic user info (name, id)
router.get('/me', authMiddleware, controllers.getUser);

// Get full user data (excluding password)
router.get('/full', authMiddleware, controllers.getFull);

// Update user (requires token)
router.post('/update', authMiddleware, controllers.updateUser);

// Delete user (requires token)
router.delete('/delete', authMiddleware, controllers.deleteUser);

module.exports = router;
