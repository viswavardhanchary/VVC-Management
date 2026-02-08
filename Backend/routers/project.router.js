const express = require('express');
const router = express.Router();

const controllers = require('../controllers/project.controllers');
const { authMiddleware } = require('../middlewares/user.auth');

// Create project
router.post('/add', authMiddleware, controllers.createProject);

// Get all projects (optional ?mine=true)
router.get('/', authMiddleware, controllers.getProjects);

// Get single project
router.get('/:id', authMiddleware, controllers.getProject);

// Update project
router.put('/:id', authMiddleware, controllers.updateProject);

// Delete project
router.delete('/:id', authMiddleware, controllers.deleteProject);

module.exports = router;
