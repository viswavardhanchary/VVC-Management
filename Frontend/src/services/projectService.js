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

/** Update project */
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

/** Update user task */
export async function updateUserTask(token, projectId, userId, payload) {
  try {
    const res = await api.put(
      `/projects/${projectId}/users/${userId}/task`,
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'Task updated' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to update task';
    return { success: false, message };
  }
}

/** Update drive link */
export async function updateDriveLink(token, projectId, userId, payload) {
  try {
    const res = await api.put(
      `/projects/${projectId}/users/${userId}/drive`,
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'Drive link updated' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to update drive link';
    return { success: false, message };
  }
}

/** Update user status (also pushes update history) */
export async function updateUserStatus(token, projectId, userId, payload) {
  try {
    const res = await api.put(
      `/projects/${projectId}/users/${userId}/status`,
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'Status updated' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to update status';
    return { success: false, message };
  }
}

/** Add comment */
export async function addComment(token, projectId, userId, payload) {
  try {
    const res = await api.post(
      `/projects/${projectId}/users/${userId}/comments`,
      payload,
      _makeAuthHeader(token)
    );
    return { success: true, data: res.data, message: 'Comment added' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to add comment';
    return { success: false, message };
  }
}
