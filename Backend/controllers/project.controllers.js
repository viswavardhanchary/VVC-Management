const Project = require('../models/project.model');

/** Create a new project */
async function createProject(req, res) {
  try {
    const { name, password, link, users_added } = req.body;
    const created_by = req.userId || req.body.created_by;
    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const project = await Project.create({ name, password, link, created_by, users_added });
    return res.status(201).json({ success: true, project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/** Get single project by id */
async function getProject(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('created_by users_added.user_id', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/** Get all projects (optionally filter by user membership or creator) */
async function getProjects(req, res) {
  try {
    const userId = req.userId;
    const { mine } = req.query; // ?mine=true to get projects created by or assigned to user

    let query = {};
    if (mine === 'true' && userId) {
      query = {
        $or: [
          { created_by: userId },
          { 'users_added.user_id': userId }
        ]
      };
    }

    const projects = await Project.find(query).populate('created_by users_added.user_id', 'name email');
    return res.json({ success: true, projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/** Update a project */
async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;

    // If users_added updates include status changes, record them in updates array inside users_added
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // handle updates for users_added if provided as full replace or partial
    if (updates.users_added && Array.isArray(updates.users_added)) {
      // simple replace - overwrite users_added
      project.users_added = updates.users_added;
      delete updates.users_added;
    }

    // apply other updates
    Object.assign(project, updates);

    await project.save();

    return res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/** Delete a project */
async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    return res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createProject, getProject, getProjects, updateProject, deleteProject };
