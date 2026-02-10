// const express = require('express');
// const router = express.Router();

// const controllers = require('../controllers/project.controllers');
// const { authMiddleware } = require('../middlewares/user.auth');

// // CRUD
// router.post('/add', authMiddleware, controllers.createProject);
// router.get('/', authMiddleware, controllers.getProjects);
// router.get('/:id', authMiddleware, controllers.getProject);
// router.put('/:id', authMiddleware, controllers.updateProject);
// router.delete('/:id', authMiddleware, controllers.deleteProject);

// // Users inside project
// router.post('/:id/users/add', authMiddleware, controllers.addUserToProject);
// router.delete('/:id/users/:userId', authMiddleware, controllers.removeUserFromProject);

// // Task updates
// router.put('/:id/users/:userId/task', authMiddleware, controllers.updateUserTask);
// router.put('/:id/users/:userId/drive', authMiddleware, controllers.updateDriveLink);
// router.put('/:id/users/:userId/status', authMiddleware, controllers.updateUserStatus);

// // Comments
// router.post('/:id/users/:userId/comments', authMiddleware, controllers.addComment);

// // Get my projects
// router.get('/mine/list', authMiddleware, controllers.getMyProjects);

// module.exports = router;

const express = require('express');
const router = express.Router();

const controllers = require('../controllers/project.controllers');
const { authMiddleware } = require('../middlewares/user.auth');

// --- Project CRUD ---
router.post('/add', authMiddleware, controllers.createProject);
router.get('/', authMiddleware, controllers.getProjects);
router.get('/mine/list', authMiddleware, controllers.getMyProjects); // Get my projects
router.get('/:id', authMiddleware, controllers.getProject);
router.put('/:id', authMiddleware, controllers.updateProject);
router.delete('/:id', authMiddleware, controllers.deleteProject);

// --- User Management in Project ---
router.post('/:id/users/add', authMiddleware, controllers.addUserToProject);
router.delete('/:id/users/:userId', authMiddleware, controllers.removeUserFromProject);

// --- Task Management (New List Structure) ---

/** * Add a NEW task to a user 
 * Note: Changed to POST because we are creating a new item in an array
 */
router.post('/:id/users/:userId/tasks', authMiddleware, controllers.addTaskToUser);

/** * Update specific task details (Drive link, Date)
 * Note: Requires `taskId` in req.body
 */
router.put('/:id/users/:userId/tasks/details', authMiddleware, controllers.updateTaskDetails);

/** * Update specific task status
 * Note: Requires `taskId` in req.body
 */
router.put('/:id/users/:userId/tasks/status', authMiddleware, controllers.updateTaskStatus);

/** * Add comment to a specific task
 * Note: Requires `taskId` in req.body
 */
router.post('/:id/users/:userId/tasks/comments', authMiddleware, controllers.addTaskComment);

module.exports = router;
