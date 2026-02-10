import { useEffect, useState } from "react";
import {
  Plus,
  LogIn,
  Pencil,
  Trash2,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewProjectModal from "../components/NewProjectModal";
import JoinProjectModal from "../components/JoinProjectModal";
import Toast from "../components/Toast";
import { 
  getProjects, 
  deleteProject, 
  removeUserFromProject 
} from "../services/projectService";

export function WorkFlow() {
  const [showNew, setShowNew] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [projects, setProjects] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [shareLink, setShareLink] = useState("");

  // confirm modal state
  const [confirmBox, setConfirmBox] = useState({
    open: false,
    type: "", // "delete" | "leave"
    project: null,
  });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  async function loadProjects() {
    const res = await getProjects(token);
    if (res.success) {
      setProjects(res.data.projects || []);
    } else {
      setToast({ message: res.message, type: "error" });
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const createdProjects = projects.filter(
    (p) => String(p.created_by?._id || p.created_by) === String(userId)
  );

  const joinedProjects = projects.filter((p) =>
    p.users_added?.some(
      (u) => String(u.user_id?._id || u.user_id) === String(userId)
    )
  );

  async function confirmDelete(projectId) {
    const res = await deleteProject(token, projectId);
    if (res.success) {
      setToast({ message: "Project deleted", type: "success" });
      loadProjects();
    } else {
      setToast({ message: res.message, type: "error" });
    }
    setConfirmBox({ open: false, type: "", project: null });
  }

  async function confirmLeave(project) {
    // Use the dedicated service method for removing a user
    const res = await removeUserFromProject(token, project._id, userId);
    
    if (res.success) {
      setToast({ message: "You left the project", type: "success" });
      loadProjects();
    } else {
      setToast({ message: res.message, type: "error" });
    }
    setConfirmBox({ open: false, type: "", project: null });
  }

  function ProjectRow({ project, isOwner }) {
    const isOpen = expandedId === project._id;

    return (
      <div className="border rounded-lg p-4 mb-3 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg text-gray-800">{project.name}</div>

          <div className="flex items-center gap-3">
            {/* Arrow toggle */}
            <button onClick={() => setExpandedId(isOpen ? null : project._id)} className="text-gray-500 hover:text-gray-700">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Owner actions */}
            {isOwner && (
              <>
                <button title="Edit" onClick={() => setEditProject(project)} className="text-gray-500 hover:text-blue-600">
                  <Pencil size={18} />
                </button>
                <button
                  title="Delete"
                  onClick={() =>
                    setConfirmBox({ open: true, type: "delete", project })
                  }
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
                <button title="Share" onClick={() => setShareLink(project.link)} className="text-gray-500 hover:text-green-600">
                  <Share2 size={18} />
                </button>
              </>
            )}

            {/* Joined project actions */}
            {!isOwner && (
              <button
                className="text-red-600 text-sm font-medium hover:underline"
                onClick={() =>
                  setConfirmBox({ open: true, type: "leave", project })
                }
              >
                Leave Group
              </button>
            )}

            {/* Open */}
            <button
              className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800"
              onClick={() => navigate(`/project/${project._id}`, { state: project })}
            >
              Open <ExternalLink size={16} />
            </button>
          </div>
        </div>

        <div
          className={`transition-all overflow-hidden ${
            isOpen ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {isOpen && (
            <div className="text-sm space-y-3 bg-gray-50 p-4 rounded-md border border-gray-100">
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                 <div><b>Password:</b> {project.password || "—"}</div>
                 <div><b>Link:</b> <span className="truncate block">{project.link || "—"}</span></div>
                 <div className="col-span-2"><b>Creator:</b> {project.created_by?.name || project.created_by}</div>
                 {project.instructions && <div className="col-span-2"><b>Instructions:</b> {project.instructions}</div>}
              </div>

              <div className="pt-2 border-t border-gray-200">
                <b className="block mb-2 text-gray-700">Team & Tasks:</b>
                {project.users_added?.length === 0 ? (
                    <div className="text-gray-400 italic">No users added yet.</div>
                ) : (
                    <ul className="space-y-3">
                    {project.users_added?.map((u, i) => (
                        <li key={i} className="bg-white p-2 rounded border border-gray-200">
                        <div className="font-medium text-gray-800 flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                                {u.email[0].toUpperCase()}
                             </div>
                             {u.email}
                        </div>
                        
                        {/* Display Tasks List */}
                        {u.tasks_listed && u.tasks_listed.length > 0 ? (
                            <ul className="mt-2 pl-8 space-y-1">
                            {u.tasks_listed.map((task, tIndex) => (
                                <li key={tIndex} className="text-xs flex items-center gap-2 text-gray-600">
                                    <FileText size={12} className="text-gray-400" />
                                    {/* Updated to show Task Name */}
                                    <span className="font-medium text-gray-700">
                                        {task.task || `Task ${tIndex + 1}`}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide border ${
                                        task.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                                        task.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        'bg-gray-50 text-gray-500 border-gray-100'
                                    }`}>
                                        {task.status}
                                    </span>
                                    {task.drive_link && (
                                        <a 
                                        href={task.drive_link} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-blue-500 hover:underline flex items-center gap-0.5"
                                        >
                                            View <ExternalLink size={10} />
                                        </a>
                                    )}
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <div className="text-xs text-gray-400 ml-8 italic mt-1">No tasks assigned</div>
                        )}
                        </li>
                    ))}
                    </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="relative inline-block mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Work Flow</h1>
        <div className="absolute left-0 -bottom-2 h-1 w-full bg-blue-500 animate-pulse"></div>
      </div>

  
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={18} /> New Project
        </button>

        <button
          onClick={() => setShowJoin(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5"
        >
          <LogIn size={18} /> Join Project
        </button>
      </div>

      {/* Created Projects */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
        Created Projects <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{createdProjects.length}</span>
      </h2>
      {createdProjects.length === 0 && (
        <div className="text-gray-400 mb-8 italic bg-gray-50 p-6 rounded-lg border border-dashed text-center">
            You haven't created any projects yet.
        </div>
      )}
      {createdProjects.map((p) => (
        <ProjectRow key={p._id} project={p} isOwner={true} />
      ))}

      {/* Joined Projects */}
      <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-700 flex items-center gap-2">
        Joined Projects <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{joinedProjects.length}</span>
      </h2>
      {joinedProjects.length === 0 && (
        <div className="text-gray-400 italic bg-gray-50 p-6 rounded-lg border border-dashed text-center">
            You haven't joined any projects yet.
        </div>
      )}
      {joinedProjects.map((p) => (
        <ProjectRow key={p._id} project={p} isOwner={false} />
      ))}

      {/* Toast */}
      <div className="fixed top-4 right-4 z-[9999]">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "info" })}
        />
      </div>

      {/* Modals */}
      {showNew && (
        <NewProjectModal
          onClose={() => {
            setShowNew(false);
            loadProjects();
          }}
        />
      )}

      {showJoin && (
        <JoinProjectModal
          onClose={() => {
            setShowJoin(false);
            loadProjects();
          }}
        />
      )}

      {editProject && (
        <NewProjectModal
          editData={editProject}
          onClose={() => {
            setEditProject(null);
            loadProjects();
          }}
        />
      )}

      {/* Share Modal */}
      {shareLink && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="font-semibold mb-3 text-lg">Share Project Link</h3>
            <div className="bg-gray-50 p-3 rounded border mb-4 break-all text-sm text-gray-600 font-mono">
                {shareLink || "No link generated"}
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors" 
                onClick={() => setShareLink("")}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  setToast({ message: "Link copied!", type: "success" });
                }}
              >
                <Share2 size={16} /> Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmBox.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="font-semibold mb-2 text-lg text-gray-800">
              {confirmBox.type === "delete" ? "Delete Project?" : "Leave Project?"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to {confirmBox.type === "delete" ? "delete" : "leave"} 
              <span className="font-bold"> {confirmBox.project?.name}</span>? 
              {confirmBox.type === "delete" && " This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setConfirmBox({ open: false, type: "", project: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => {
                  if (confirmBox.type === "delete")
                    confirmDelete(confirmBox.project._id);
                  else confirmLeave(confirmBox.project);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}