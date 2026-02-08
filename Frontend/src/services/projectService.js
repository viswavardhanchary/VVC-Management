import api from '../utils/api';

function _makeAuthHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function createProject(token, { name, password, link, users_added }) {
  try {
    const res = await api.post('/projects/add', { name, password, link, users_added }, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Project created successfully' };
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Failed to create project';
    return { success: false, message };
  }
}

export async function getProjects(token, { mine } = {}) {
  try {
    const query = mine ? '?mine=true' : '';
    const res = await api.get(`/projects${query}`, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Projects fetched successfully' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to fetch projects';
    return { success: false, message };
  }
}

export async function getProject(token, projectId) {
  try {
    const res = await api.get(`/projects/${projectId}`, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Project fetched successfully' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to fetch project';
    return { success: false, message };
  }
}

export async function updateProject(token, projectId, updates) {
  try {
    const res = await api.put(`/projects/${projectId}`, updates, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Project updated successfully' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to update project';
    return { success: false, message };
  }
}

export async function deleteProject(token, projectId) {
  try {
    const res = await api.delete(`/projects/${projectId}`, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Project deleted successfully' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to delete project';
    return { success: false, message };
  }
}
