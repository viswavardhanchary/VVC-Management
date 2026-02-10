const Project = require('../models/project.model');

/** Create project */
async function createProject(req, res) {
  try {
    const { name, password, link, users_added, instructions } = req.body;
    const created_by = req.userId;

    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const project = await Project.create({
      name,
      password,
      link,
      created_by,
      instructions,
      // Ensure users_added follows the new structure if passed during creation
      users_added: users_added || [], 
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** Get all projects */
async function getProjects(req, res) {
  try {
    const projects = await Project.find()
      .populate('created_by users_added.user_id', 'name email');

    res.json({ success: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** Get only my projects */
async function getMyProjects(req, res) {
  try {
    const userId = req.userId;

    const projects = await Project.find({
      $or: [
        { created_by: userId },
        { 'users_added.user_id': userId },
      ],
    }).populate('created_by users_added.user_id', 'name email');

    res.json({ success: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** Get single project */
async function getProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)
      .populate('created_by users_added.user_id', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** Update project (General details like name, password) */
async function updateProject(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** Delete project */
async function deleteProject(req, res) {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });

    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** * Add user to project */
async function addUserToProject(req, res) {
  try {
    const { user_id, email, instructions , tasks_listed} = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          users_added: {
            user_id,
            email,
            instructions: instructions || "",
            tasks_listed: tasks_listed || [] // Initialize empty array for tasks
          },
        },
      },
      { new: true }
    ).populate('users_added.user_id', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** Remove user from project */
async function removeUserFromProject(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { users_added: { user_id: req.params.userId } },
      },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** * Add a NEW Task to a User 
 * UPDATED: Now accepts 'task' (description) + 'drive_link' + 'date'
 */
async function addTaskToUser(req, res) {
  try {
    const { task, drive_link, date_to_completed } = req.body;

    // We can't use simple findOneAndUpdate easily because users_added has _id: false
    // We fetch, modify, and save.
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Find the specific user within the project
    const userEntry = project.users_added.find(
      u => u.user_id.toString() === req.params.userId
    );

    if (!userEntry) return res.status(404).json({ message: 'User not found in project' });

    // Push new task to tasks_listed
    userEntry.tasks_listed.push({
      task: task || "New Task", // The admin instruction
      drive_link: drive_link || "", // The user submission (initially empty usually)
      date_to_completed,
      status: 'assigned',
      updates: [],
      comments: {}
    });

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** * Update task details 
 * UPDATED: Now allows updating the 'task' name as well as 'drive_link' and 'date'
 * REQUIRES: taskId in body
 */
async function updateTaskDetails(req, res) {
  try {
    const { taskId, task, drive_link, date_to_completed } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userEntry = project.users_added.find(
      u => u.user_id.toString() === req.params.userId
    );
    if (!userEntry) return res.status(404).json({ message: 'User not found' });

    // Find the specific task inside the user's list
    const foundTask = userEntry.tasks_listed.id(taskId);
    if (!foundTask) return res.status(404).json({ message: 'Task not found' });

    // Update fields if they are present in body
    if (task !== undefined) foundTask.task = task;
    if (drive_link !== undefined) foundTask.drive_link = drive_link;
    if (date_to_completed !== undefined) foundTask.date_to_completed = date_to_completed;

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** * Update status + push update history 
 * REQUIRES: taskId in body
 */
async function updateTaskStatus(req, res) {
  try {
    const { taskId, status } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userEntry = project.users_added.find(
      u => u.user_id.toString() === req.params.userId
    );
    if (!userEntry) return res.status(404).json({ message: 'User not found in project' });

    // Find the specific task
    const task = userEntry.tasks_listed.id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const oldStatus = task.status;
    task.status = status;

    // Push to the updates array inside the specific task
    task.updates.push({
      from: oldStatus,
      to: status,
      date: new Date(),
    });

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** * Add comment to a specific task
 * REQUIRES: taskId in body
 */
async function addTaskComment(req, res) {
  try {
    const { taskId, text, type, name } = req.body; // type: by_creator | by_others | by_user

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userEntry = project.users_added.find(
      u => u.user_id.toString() === req.params.userId
    );
    if (!userEntry) return res.status(404).json({ message: 'User not found' });

    const task = userEntry.tasks_listed.id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Construct comment object
    const commentData = {
      text,
      name: name || 'User', // You might want to fetch the real name based on req.userId
      last_edited: new Date()
    };

    // Push to the correct array in the comments object
    if (task.comments[type]) {
      task.comments[type].push(commentData);
    } else {
      // Fallback if the array doesn't exist (though Schema default should handle this)
      task.comments[type] = [commentData];
    }

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createProject,
  getProjects,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject,
  addUserToProject,
  removeUserFromProject,
  addTaskToUser,
  updateTaskDetails,
  updateTaskStatus,
  addTaskComment,
};