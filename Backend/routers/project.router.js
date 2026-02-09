const express = require('express');
const router = express.Router();

const controllers = require('../controllers/project.controllers');
const { authMiddleware } = require('../middlewares/user.auth');

// CRUD
router.post('/add', authMiddleware, controllers.createProject);
router.get('/', authMiddleware, controllers.getProjects);
router.get('/:id', authMiddleware, controllers.getProject);
router.put('/:id', authMiddleware, controllers.updateProject);
router.delete('/:id', authMiddleware, controllers.deleteProject);

// Users inside project
router.post('/:id/users/add', authMiddleware, controllers.addUserToProject);
router.delete('/:id/users/:userId', authMiddleware, controllers.removeUserFromProject);

// Task updates
router.put('/:id/users/:userId/task', authMiddleware, controllers.updateUserTask);
router.put('/:id/users/:userId/drive', authMiddleware, controllers.updateDriveLink);
router.put('/:id/users/:userId/status', authMiddleware, controllers.updateUserStatus);

// Comments
router.post('/:id/users/:userId/comments', authMiddleware, controllers.addComment);

// Get my projects
router.get('/mine/list', authMiddleware, controllers.getMyProjects);

module.exports = router;
