const Project = require('../models/project.model');

/** Create project */
async function createProject(req, res) {
  try {
    const { name, password, link, users_added } = req.body;
    const created_by = req.userId;

    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const project = await Project.create({
      name,
      password,
      link,
      created_by,
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

/** Update project */
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

/** Add user to project */
async function addUserToProject(req, res) {
  try {
    const { user_id, email, tasks } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          users_added: {
            user_id,
            email,
            tasks,
            status: 'assigned',
            updates: [],
            comments: {},
          },
        },
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

/** Update user task */
async function updateUserTask(req, res) {
  try {
    const { tasks } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, 'users_added.user_id': req.params.userId },
      { $set: { 'users_added.$.tasks': tasks } },
      { new: true }
    );

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** Update drive link */
async function updateDriveLink(req, res) {
  try {
    const { drive_link } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, 'users_added.user_id': req.params.userId },
      { $set: { 'users_added.$.drive_link': drive_link } },
      { new: true }
    );

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/** Update status + push update history */
async function updateUserStatus(req, res) {
  try {
    const { status } = req.body;

    const project = await Project.findOne({ _id: req.params.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const user = project.users_added.find(
      u => u.user_id.toString() === req.params.userId
    );
    if (!user) return res.status(404).json({ message: 'User not found in project' });

    const oldStatus = user.status;
    user.status = status;

    user.updates.push({
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

/** Add comment */
async function addComment(req, res) {
  try {
    const { text, type } = req.body; // type: by_creator | by_others | by_user

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, 'users_added.user_id': req.params.userId },
      {
        $push: {
          [`users_added.$.comments.${type}`]: text,
        },
      },
      { new: true }
    );

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
  updateUserTask,
  updateDriveLink,
  updateUserStatus,
  addComment,
};
