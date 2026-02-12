import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Edit2, Trash2, ExternalLink, Loader } from 'lucide-react';
import Toast from '../components/Toast';
import { getMe, updateUser, deleteUser } from '../services/userService';
import { getMyProjects } from '../services/projectService';

export function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const [user, setUser] = useState(null);
  const [createdProjects, setCreatedProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userId || !token) {
      navigate('/login');
      return;
    }

    loadUserData();
  }, [userId, token, navigate]);

  async function loadUserData() {
    try {
      setLoading(true);
      const userRes = await getMe(token);
      if (userRes.success) {
        const userData = userRes.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
        });
      } else {
        setToast({ message: 'Failed to load user data', type: 'error' });
        navigate('/login');
      }

      const projectRes = await getMyProjects(token);
      if (projectRes.success) {
        const allProjects = projectRes.data.projects || [];
        const created = allProjects.filter(
          (p) => String(p.created_by?._id || p.created_by) === String(userId)
        );
        const joined = allProjects.filter((p) =>
          p.users_added?.some(
            (u) => String(u.user_id?._id || u.user_id) === String(userId)
          )
        );
        setCreatedProjects(created);
        setJoinedProjects(joined);
      }
    } catch (err) {
      setToast({ message: 'Error loading data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function getInitial(name) {
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  const initial = getInitial(user?.name);

  async function handleUpdateUser(e) {
    e.preventDefault();
    const updates = {};
    if (formData.name !== user.name) updates.name = formData.name;
    if (formData.email !== user.email) updates.email = formData.email;
    if (formData.password) updates.password = formData.password;

    if (Object.keys(updates).length === 0) {
      setToast({ message: 'No changes to update', type: 'info' });
      return;
    }

    const res = await updateUser(token, updates);
    if (res.success) {
      setUser(res.data.user);
      setFormData({
        name: res.data.user.name || '',
        email: res.data.user.email || '',
        password: '',
      });
      setEditMode(false);
      setToast({ message: 'Profile updated successfully', type: 'success' });
    } else {
      setToast({ message: res.message || 'Failed to update profile', type: 'error' });
    }
  }

  async function handleDeleteAccount() {
    const res = await deleteUser(token);
    if (res.success) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setToast({ message: 'Account deleted successfully', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setToast({ message: res.message || 'Failed to delete account', type: 'error' });
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-cyan-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-cyan-600" />
          <p className="text-cyan-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-cyan-50 to-white">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">User not found</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50 to-white py-8 px-4">
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-6xl mx-auto">
        {/* Header with Avatar and Basic Info */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-5xl font-bold text-white">{initial}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-teal-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{user.email}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium"
                >
                  <Edit2 className="w-4 h-4" /> {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-50 transition font-medium"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editMode && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 animate-slideInUp">
            <h2 className="text-2xl font-bold text-teal-900 mb-6">Update Profile</h2>
            <form onSubmit={handleUpdateUser} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-600 transition"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-600 transition"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password (Leave empty to keep current)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-600 transition"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      password: '',
                    });
                  }}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Created Projects */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-teal-900 mb-6">
              Projects Created ({createdProjects.length})
            </h2>
            {createdProjects.length > 0 ? (
              <div className="space-y-3">
                {createdProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-4 bg-linear-to-r from-cyan-50 to-teal-50 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-teal-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">
                        {project.users_added?.length || 0} members
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/project/${project._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" /> Open
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No projects created yet</p>
                <button
                  onClick={() => navigate('/home/workflow')}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </div>

          {/* Joined Projects */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-teal-900 mb-6">
              Projects Joined ({joinedProjects.length})
            </h2>
            {joinedProjects.length > 0 ? (
              <div className="space-y-3">
                {joinedProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-teal-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">
                        Created by {project.created_by?.name || 'Unknown'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/project/${project._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" /> Open
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No projects joined yet</p>
                <button
                  onClick={() => navigate('/home/workflow')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                >
                  Join a Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Danger Zone</h2>
          <p className="text-red-700 mb-6">
            Deleting your account is permanent and cannot be undone. All your data will be lost.
          </p>

          {confirmDelete ? (
            <div className="bg-white rounded-lg p-6 border-2 border-red-300">
              <p className="text-gray-700 font-medium mb-4">
                Are you sure you want to delete your account? This action cannot be reversed.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Yes, Delete Account
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 