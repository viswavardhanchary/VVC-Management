import api from '../utils/api';

function _makeAuthHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

/** Create project */
export async function createProject(token, payload) {
  try {
    const res = await api.post('/projects/add', payload, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Project created' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to create project';
    return { success: false, message };
  }
}

/** Get all projects */
export async function getProjects(token) {
  try {
    const res = await api.get('/projects', _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Projects fetched' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to fetch projects';
    return { success: false, message };
  }
}

/** Get my projects */
export async function getMyProjects(token) {
  try {
    const res = await api.get('/projects/mine/list', _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'My projects fetched' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to fetch my projects';
    return { success: false, message };
  }
}

/** Get single project */
export async function getProject(token, projectId) {
  try {
    const res = await api.get(`/projects/${projectId}`, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Project fetched' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to fetch project';
    return { success: false, message };
  }
}

/** Update project details (Name, instructions, etc.) */
export async function updateProject(token, projectId, updates) {
  try {
    const res = await api.put(`/projects/${projectId}`, updates, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Project updated' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to update project';
    return { success: false, message };
  }
}

/** Delete project */
export async function deleteProject(token, projectId) {
  try {
    const res = await api.delete(`/projects/${projectId}`, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Project deleted' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to delete project';
    return { success: false, message };
  }
}

/** Add user to project */
export async function addUserToProject(token, projectId, payload) {
  try {
    const res = await api.post(
      `/projects/${projectId}/users/add`,
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'User added to project' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to add user';
    return { success: false, message };
  }
}

/** Remove user from project */
export async function removeUserFromProject(token, projectId, userId) {
  try {
    const res = await api.delete(
      `/projects/${projectId}/users/${userId}`,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'User removed from project' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to remove user';
    return { success: false, message };
  }
}

/** * Add a NEW Task to a user 
 * (Replaces updateUserTask)
 */
export async function addTaskToUser(token, projectId, userId, payload) {
  try {
    // Payload should contain: { task, drive_link, date_to_completed }
    const res = await api.post(
      `/projects/${projectId}/users/${userId}/tasks`, 
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'Task added successfully' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to add task';
    return { success: false, message };
  }
}

/** * Update task details (Task Name, Drive link, Date) 
 * (Replaces updateDriveLink)
 */
export async function updateTaskDetails(token, projectId, userId, payload) {
  try {
    // Payload MUST contain: { taskId, task?, drive_link?, date_to_completed? }
    const res = await api.put(
      `/projects/${projectId}/users/${userId}/tasks/details`,
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'Task details updated' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to update task details';
    return { success: false, message };
  }
}

/** * Update task status 
 */
export async function updateTaskStatus(token, projectId, userId, payload) {
  try {
    // Payload MUST contain: { taskId, status }
    const res = await api.put(
      `/projects/${projectId}/users/${userId}/tasks/status`,
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'Task status updated' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to update task status';
    return { success: false, message };
  }
}

/** * Add comment to a specific task 
 */
export async function addTaskComment(token, projectId, userId, payload) {
  try {
    // Payload MUST contain: { taskId, text, type, name }
    const res = await api.post(
      `/projects/${projectId}/users/${userId}/tasks/comments`,
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'Comment added' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to add comment';
    return { success: false, message };
  }
}