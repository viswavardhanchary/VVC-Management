import api from '../utils/api';

function _makeAuthHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function register({ name, email, password , role}) {
  try {
    const res = await api.post('/users/add', { name, email, password ,role});
    // backend returns { token, user }
    return { success: true, data: res.data, message: 'User registered' };
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Registration failed';
    return { success: false, message };
  }
}

export async function login({ email, password }) {
  try {
    const res = await api.post('/users/login', { email, password });
    // backend returns { token, user }
    return { success: true, data: res.data, message: 'Login successful' };
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Login failed';
    return { success: false, message };
  }
}

export async function verify(token) {
  try {
    const res = await api.get('/users/verify', _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Token valid' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Token invalid or expired';
    return { success: false, message };
  }
}

export async function getMe(token) {
  try {
    const res = await api.get('/users/me', _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Fetched user basic info' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to fetch user';
    return { success: false, message };
  }
}

export async function getFull(token) {
  try {
    const res = await api.get('/users/full', _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'Fetched full user data' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Failed to fetch user data';
    return { success: false, message };
  }
}

export async function updateUser(token, updates) {
  try {
    const res = await api.post('/users/update', updates, _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'User updated' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Update failed';
    return { success: false, message };
  }
}

export async function deleteUser(token) {
  try {
    const res = await api.delete('/users/delete', _makeAuthHeader(token));
    return { success: true, data: res.data, message: 'User deleted' };
  } catch (err) {
    const message = err?.response?.data?.message || 'Delete failed';
    return { success: false, message };
  }
}
