import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, createSearchParams } from "react-router-dom";
import {
  getProject,
  updateTaskStatus,
  updateTaskDetails,
  addTaskToUser,
  addUserToProject,
  deleteTask as deleteTaskAPI
} from "../services/projectService";
import Toast from "../components/Toast";
import { CommentsModal } from "../components/CommentsModal";
import { LogsModal } from "../components/LogsModal";
import {
  ExternalLink,
  MessageSquare,
  History,
  FileText,
  Lock,
  Edit2,
  Check,
  X as XIcon,
  Plus,
  User,
  Calendar,
  Link as LinkIcon,
  Trash2
} from "lucide-react";
import { WEBSITE_BASE_URL } from "../utils/constants";

const COLUMNS = ["assigned", "active", "completed", "closed", "errors"];

export function Project() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
   const location = useLocation();

  const [project, setProject] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "info" });


  const [showComments, setShowComments] = useState(null);
  const [showLogs, setShowLogs] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Edit task modal
  const [editingTask, setEditingTask] = useState(null);
  const [editingTaskEmail, setEditingTaskEmail] = useState("");
  
  // Delete task confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, task: null, userEmail: "" });


  const ghostRef = useRef(null);
  const dragItemRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  async function loadProject() {
    if(!userId) {
      setToast({message: 'Login to Use. Redirecting...' , type: 'info'});
      navigate('/login')
    }
    const res = await getProject(token, id);
    if (res.success) {
      setProject(res.data.project);
    } else {
      setToast({ message: res.message, type: "error" });
    }
  }

  useEffect(() => {
    loadProject();
  }, [id]);

  if (!project) return <div className="p-6 text-gray-500">Loading project board...</div>;

  const isOwner = String(project.created_by?._id || project.created_by) === String(userId);


  function TaskCard({ task }) {
    console.log(task);
    const [isEditing, setIsEditing] = useState(false);
    const [driveLink, setDriveLink] = useState(task.drive_link || "");

    const taskOwnerId = task.userId ? String(task.userId) : null;
    const canMove = (isOwner && taskOwnerId) || taskOwnerId === String(userId);

    const canEdit = isOwner || taskOwnerId === String(userId);

    async function handleSaveLink() {
      if (!canEdit) return;

      const payload = {
        taskId: task._id,
        drive_link: driveLink
      };

      const res = await updateTaskDetails(token, project._id, task.userId, payload);
      if (res.success) {
        setToast({ message: "Submission link updated", type: "success" });
        setIsEditing(false);
        loadProject();
      } else {
        setToast({ message: res.message || "Failed to update", type: "error" });
      }
    }

    return (
      <div
        onMouseDown={(e) => !isEditing && onMouseDown(e, task)}
        className={`
          rounded-lg p-4 shadow-sm border border-gray-100 
          transition-all group relative mb-3
          ${!isEditing && canMove ? "cursor-grab active:cursor-grabbing hover:shadow-md" : ""}
          ${!isEditing && !canMove ? "cursor-not-allowed opacity-80" : ""}
          ${task.userId === localStorage.getItem('userId') && new Date(task.date_to_completed) >= new Date() && task.status !== 'completed' ? "bg-orange-100" :
            task.userId === localStorage.getItem('userId') && new Date(task.date_to_completed) < new Date() && task.status !== 'completed' ? "bg-red-200" : task.userId === localStorage.getItem('userId') && task.status === 'completed' ? "bg-green-200" : "bg-white"}
        `}
      >

        {!canMove && !isEditing && (
          <div className="absolute top-2 right-2 text-gray-300">
            <Lock size={12} />
          </div>
        )}


        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold" title={task.userEmail}>
            {task.userEmail?.[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-gray-500 truncate max-w-37.5">
            {task.userEmail}
          </span>
        </div>


        <div className="mb-3 font-semibold text-gray-800 text-sm flex items-start gap-2">
          <FileText size={14} className="mt-0.5 text-gray-400 shrink-0" />
          <span className="wrap-break-words">{task.task || "Untitled Task"}</span>
        </div>


        <div className="mb-3 text-xs">
          {isEditing ? (
            <div className="flex gap-1 items-center" onMouseDown={(e) => e.stopPropagation()}>
              <input
                className="flex-1 border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="Paste drive link here..."
                autoFocus
              />
              <button onClick={handleSaveLink} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
                <Check size={12} />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                <XIcon size={12} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center group/link">
              <div className="flex-1 overflow-hidden">
                {task.drive_link ? (
                  task.drive_link.startsWith("http") ? (
                    <a
                      href={task.drive_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded w-fit"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={10} /> View Submission
                    </a>
                  ) : (
                    <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded block truncate" title={task.drive_link}>
                      {task.drive_link}
                    </span>
                  )
                ) : (
                  <span className="italic text-gray-400">No submission yet</span>
                )}
              </div>

              {canEdit && (
                <button
                  onClick={() => {
                    setDriveLink(task.drive_link || "");
                    setIsEditing(true);
                  }}
                  className="ml-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover/link:opacity-100 transition-opacity"
                  title="Edit Link"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Edit2 size={12} />
                </button>
              )}
            </div>
          )}
        </div>


        {task.date_to_completed && (
          <div className="text-[10px] mb-3 bg-red-50 text-red-500 px-2 py-0.5 rounded w-fit">
            Due: {new Date(task.date_to_completed).toLocaleDateString()}
          </div>
        )}


        <div className="flex justify-between items-center border-t pt-2 mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComments(task)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <MessageSquare size={14} />
              {(task.comments?.by_creator?.length || 0) + (task.comments?.by_user?.length || 0) + (task.comments?.by_others?.length || 0)}
            </button>

            <button
              onClick={() => setShowLogs(task)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <History size={14} />
            </button>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditTask(task)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-600 transition-colors p-1 hover:bg-cyan-50 rounded"
                title="Edit Task"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDeleteTask(task)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                title="Delete Task"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function onMouseDown(e, taskData) {
    const taskOwnerId = taskData.userId ? String(taskData.userId) : null;
    const currentUserId = String(userId);

    if (!taskOwnerId) {
      setToast({ message: "User has not joined yet. Cannot move task.", type: "error" });
      return;
    }

    if (!isOwner && taskOwnerId !== currentUserId) {
      setToast({ message: "Access Denied: You can only move your own tasks.", type: "error" });
      return;
    }

    e.preventDefault();
    document.body.style.userSelect = "none";

    dragItemRef.current = taskData;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const ghost = card.cloneNode(true);
    ghost.style.position = "fixed";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "0.8";
    ghost.style.zIndex = "9999";
    ghost.style.left = rect.left + "px";
    ghost.style.top = rect.top + "px";
    ghost.style.width = rect.width + "px";
    ghost.style.transform = "rotate(2deg)";

    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    if (!ghostRef.current) return;
    ghostRef.current.style.left = e.clientX - offsetRef.current.x + "px";
    ghostRef.current.style.top = e.clientY - offsetRef.current.y + "px";
  }

  function isPointInsideRect(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  async function onMouseUp(e) {
    if (!ghostRef.current || !dragItemRef.current) return;

    const ghost = ghostRef.current;
    let newStatus = null;

    document.querySelectorAll("[data-column]").forEach((col) => {
      const rect = col.getBoundingClientRect();
      if (isPointInsideRect(e.clientX, e.clientY, rect)) {
        newStatus = col.dataset.column;
      }
    });

    if (newStatus && newStatus !== dragItemRef.current.status) {
      await moveTask(dragItemRef.current, newStatus);
    }

    ghost.remove();
    ghostRef.current = null;
    dragItemRef.current = null;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  async function moveTask(taskData, toStatus) {
    const payload = {
      taskId: taskData._id,
      status: toStatus
    };
    const res = await updateTaskStatus(token, project._id, taskData.userId, payload);
    if (res.success) {
      setToast({ message: "Task moved", type: "success" });
      loadProject();
    } else {
      setToast({ message: res.message, type: "error" });
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditingTaskEmail(task.userEmail || "");
  };

  const handleSaveTaskEdit = async (taskDesc, deadline) => {
    if (!editingTask) return;

    if(!editingTask.userId) {
      setToast({ message: "User has not Joined! Cannot Make Changes!", type: "error" });
    }else {

    const payload = {
      taskId: editingTask._id,
      task: taskDesc,
      date_to_completed: deadline
    };

    const res = await updateTaskDetails(token, project._id, editingTask.userId, payload);
    if (res.success) {
      setToast({ message: "Task updated successfully!", type: "success" });
      setEditingTask(null);
      loadProject();
    } else {
      setToast({ message: res.message, type: "error" });
    }
  }
  };

  const handleDeleteTask = (task) => {
    setDeleteConfirm({
      open: true,
      task: task,
      userEmail: task.userEmail || ""
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.task) return;

    const payload = {
      taskId: deleteConfirm.task._id
    };
    if(!editingTask.userId) {
      setToast({ message: "User has not Joined! Cannot Make Changes!", type: "error" });
    }else {

    const res = await deleteTaskAPI(token, project._id, deleteConfirm.task.userId, payload);
    if (res.success) {
      setToast({ message: "Task deleted successfully!", type: "success" });
      setDeleteConfirm({ open: false, task: null, userEmail: "" });
      loadProject();
    } else {
      setToast({ message: res.message || "Failed to delete task", type: "error" });
    }
  }
  };

  const getAllTasks = () => {
    const allTasks = [];
    if (!project.users_added) return [];

    project.users_added.forEach(u => {
      const uId = u.user_id?._id || u.user_id || null;
      const uEmail = u.email;

      if (u.tasks_listed && u.tasks_listed.length > 0) {
        u.tasks_listed.forEach(t => {
          allTasks.push({
            ...t,
            userId: uId,
            userEmail: uEmail
          });
        });
      }
    });
    return allTasks;
  };

  const tasks = getAllTasks();


  function AddModal({ onClose }) {
    const [email, setEmail] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleAdd() {
      if (!email.trim()) return setToast({ message: "Email is required", type: "error" });
      setLoading(true);

      // 1. Find if user exists in project
      const existingUser = project.users_added.find(u => u.email.toLowerCase() === email.toLowerCase());
      console.log(existingUser);

      if (existingUser) {
        // Case A: User exists
        if (!existingUser.user_id._id) {
          // User invited but not joined -> Backend addTaskToUser requires userId, so we can't add task yet
          setToast({ message: "User invited but hasn't joined. Cannot assign tasks yet.", type: "warning" });
        } else {
          // User joined -> Add Task
          if (!taskDesc) {
            setToast({ message: "User exists. Please enter a task description.", type: "warning" });
            setLoading(false);
            return;
          }
          const res = await addTaskToUser(token, project._id, existingUser.user_id._id, {
            task: taskDesc,
            drive_link: "",
            date_to_completed: date
          });
          if (res.success) {
            setToast({ message: "Task added to user!", type: "success" });
            onClose();
            loadProject();
          } else {
            setToast({ message: res.message, type: "error" });
          }
        }
      } else {
        // Case B: New User -> Invite them
        const tasks_listed = {
          task: taskDesc,
          drive_link: "",
          status: "assigned",
          date_to_completed: date || null,
          comments: {},
          updates: [{
            from: "assigned",
            to: "assigned",
            date: new Date(),
          }],
        }
        const userAddingNew = {

          user_id: null,
          email: email,
          tasks_listed: tasks_listed,
          instructions: "",
        }

        const res = await addUserToProject(token, project._id, userAddingNew);
        if (res.success) {
          setToast({ message: "User invited successfully! You can assign tasks once they join.", type: "success" });
          onClose();
          loadProject();
        } else {
          setToast({ message: res.message, type: "error" });
        }
      }
      setLoading(false);
    }

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Add People / Task</h3>
            <button onClick={onClose}><XIcon className="text-gray-500" /></button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">User Email</label>
              <div className="flex items-center border rounded px-3 py-2 mt-1">
                <User size={16} className="text-gray-400 mr-2" />
                <input
                  className="flex-1 outline-none text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Task Description</label>
              <div className="flex items-center border rounded px-3 py-2 mt-1">
                <FileText size={16} className="text-gray-400 mr-2" />
                <input
                  className="flex-1 outline-none text-sm"
                  placeholder="e.g. Frontend Design"
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Due Date (Optional)</label>
              <div className="flex items-center border rounded px-3 py-2 mt-1">
                <Calendar size={16} className="text-gray-400 mr-2" />
                <input
                  type="date"
                  className="flex-1 outline-none text-sm"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Processing..." : "Add to Project"}
          </button>
        </div>
      </div>
    );
  }

  function EditTaskModal({ task, userEmail, onClose }) {
    const [taskDesc, setTaskDesc] = useState(task.task || "");
    const [deadline, setDeadline] = useState(task.date_to_completed ? task.date_to_completed.split('T')[0] : "");
    const [loading, setLoading] = useState(false);

    async function handleSave() {
      if (!taskDesc.trim()) {
        setToast({ message: "Task description is required", type: "error" });
        return;
      }

      setLoading(true);
      await handleSaveTaskEdit(taskDesc, deadline);
      setLoading(false);
    }

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl border border-cyan-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-teal-900">Edit Task</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XIcon size={20} />
            </button>
          </div>

          <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
            <p className="text-gray-600">
              <strong className="text-teal-900">User:</strong> {userEmail}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-teal-900 uppercase">Task Description</label>
              <div className="flex items-center border border-cyan-200 rounded px-3 py-2 mt-1">
                <FileText size={16} className="text-cyan-600 mr-2" />
                <input
                  className="flex-1 outline-none text-sm"
                  placeholder="e.g. Frontend Design"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-teal-900 uppercase">Due Date (Optional)</label>
              <div className="flex items-center border border-cyan-200 rounded px-3 py-2 mt-1">
                <Calendar size={16} className="text-cyan-600 mr-2" />
                <input
                  type="date"
                  className="flex-1 outline-none text-sm"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-linear-to-r from-cyan-500 to-emerald-500 text-white py-2 rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function DeleteConfirmationModal({ task, userEmail, onConfirm, onCancel, loading }) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 backdrop-blur-sm">
        <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl border border-red-200">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-red-600">Delete Task</h3>
            <p className="text-sm text-gray-600 mt-1">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded mb-4 text-sm space-y-2">
            <p className="text-gray-600">
              <strong className="text-teal-900">User:</strong> {userEmail}
            </p>
            <p className="text-gray-600">
              <strong className="text-teal-900">Task:</strong> {task.task}
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 h-screen flex flex-col bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>{tasks.length} tasks</span>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>{project.users_added.length} members</span>
              </div>
            </div>


            <div className="flex flex-wrap items-center gap-2 ">
              {isOwner && <span className="text-blue-600 bg-blue-50 px-2 rounded font-medium">Owner View</span>}
              <span className="text-orange-500 bg-blue-50 px-2 rounded font-medium">
                <span>Your Task Color</span>
              </span>
              <span className="text-red-500 bg-blue-50 px-2 rounded font-medium">
                <span>Due Tasks Color</span>
              </span>
              <span className="text-green-500 bg-blue-50 px-2 rounded font-medium">
                <span>Completed Tasks Color</span>
              </span>
            </div>


          </div>
        </div>

        <div className="flex flex-wrap +items-center gap-3">
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
            ID: <span className="font-mono select-all">{project._id}</span>
          </div>
          {isOwner && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus size={18} /> Add People / Task
            </button>
          )}
        </div>
      </div>

      {/* Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 h-full min-w-250">
          {COLUMNS.map((col) => (
            <div
              key={col}
              data-column={col}
              className="flex-1 bg-gray-100/80 rounded-xl p-3 flex flex-col min-w-70 border border-gray-200"
            >
              {/* Column Header */}
              <h2 className="font-bold uppercase text-xs text-gray-500 mb-4 flex justify-between px-1">
                {col}
                <span className="bg-gray-200 text-gray-600 px-2 rounded-full">
                  {tasks.filter(t => t.status === col).length}
                </span>
              </h2>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {tasks
                  .filter((t) => t.status === col)
                  .map((t) => (
                    <TaskCard key={t._id} task={t} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      <div className="fixed top-4 right-4 z-9999">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "info" })}
        />
      </div>

      {/* Add Modal */}
      {showAddModal && <AddModal onClose={() => setShowAddModal(false)} />}

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal
          task={showComments}
          userId={showComments.userId}
          projectId={project._id}
          onClose={() => setShowComments(null)}
          onSaved={loadProject}
        />
      )}

      {/* Logs Modal */}
      {showLogs && (
        <LogsModal
          task={showLogs}
          onClose={() => setShowLogs(null)}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          userEmail={editingTaskEmail}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && deleteConfirm.task && (
        <DeleteConfirmationModal
          task={deleteConfirm.task}
          userEmail={deleteConfirm.userEmail}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm({ open: false, task: null, userEmail: "" })}
          loading={false}
        />
      )}
    </div>
  );
}