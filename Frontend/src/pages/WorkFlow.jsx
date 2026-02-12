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


  const [confirmBox, setConfirmBox] = useState({
    open: false,
    type: "", 
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
      <div className="border border-cyan-200 rounded-xl p-5 mb-4 bg-white shadow-md hover:shadow-lg transition-all hover:border-cyan-400 animate-slideInUp">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg text-teal-900">{project.name}</div>

          <div className="flex items-center gap-3">
            {/* Arrow toggle - animated */}
            <button onClick={() => setExpandedId(isOpen ? null : project._id)} className="text-cyan-600 hover:text-cyan-800 transition-all duration-300 hover:bg-cyan-50 p-1 rounded-full">
              {isOpen ? <ChevronUp size={20} className="animate-pulse" /> : <ChevronDown size={20} />}
            </button>

            {/* Owner actions */}
            {isOwner && (
              <>
                <button title="Edit" onClick={() => setEditProject(project)} className="text-cyan-600 hover:text-cyan-800 transition-colors hover:bg-cyan-50 p-1 rounded">
                  <Pencil size={18} />
                </button>
                <button
                  title="Delete"
                  onClick={() =>
                    setConfirmBox({ open: true, type: "delete", project })
                  }
                  className="text-red-500 hover:text-red-700 transition-colors hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 size={18} />
                </button>
                <button title="Share" onClick={() => setShareLink(project.link)} className="text-emerald-600 hover:text-emerald-800 transition-colors hover:bg-emerald-50 p-1 rounded">
                  <Share2 size={18} />
                </button>
              </>
            )}

            {/* Joined project actions */}
            {!isOwner && (
              <button
                className="text-red-600 text-sm font-bold hover:text-red-800 transition-colors hover:bg-red-50 px-3 py-1 rounded"
                onClick={() =>
                  setConfirmBox({ open: true, type: "leave", project })
                }
              >
                Leave
              </button>
            )}

            {/* Open */}
            <button
              className="flex items-center gap-1 text-cyan-600 font-bold hover:text-cyan-800 transition-all hover:scale-105 hover:bg-cyan-50 px-3 py-1 rounded"
              onClick={() => navigate(`/project/${project._id}`, { state: project })}
            >
              Open <ExternalLink size={16} />
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden origin-top ${
            isOpen ? "max-h-250 opacity-100 animate-slideDown" : "max-h-0 opacity-0"
          }`}
        >
          {isOpen && (
            <div className="text-sm space-y-3 bg-cyan-50/40 p-4 rounded-lg border border-cyan-200 mt-4">
              <div className="grid grid-cols-2 gap-2 text-teal-900">
                 <div><b className="text-teal-700">Password:</b> <span className="text-black">{project.password || "—"}</span></div>
                 <div><b className="text-teal-700">Link:</b> <span className="truncate block text-black">{project.link || "—"}</span></div>
                 <div className="col-span-2"><b className="text-teal-700">Creator:</b> <span className="text-black">{project.created_by?.name || project.created_by}</span></div>
                 {project.instructions && <div className="col-span-2"><b className="text-teal-700">Instructions:</b> <span className="text-black">{project.instructions}</span></div>}
              </div>

              <div className="pt-3 border-t border-cyan-200">
                <b className="block mb-3 text-teal-900">Team & Tasks:</b>
                {project.users_added?.length === 0 ? (
                    <div className="text-teal-500 italic text-sm">No users added yet.</div>
                ) : (
                    <ul className="space-y-3">
                    {project.users_added?.map((u, i) => (
                        <li key={i} className="bg-white p-3 rounded-lg border border-cyan-200 hover:border-cyan-300 transition-all">
                        <div className="font-medium text-teal-900 flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 text-white flex items-center justify-center text-xs font-bold">
                                {u.email[0].toUpperCase()}
                             </div>
                             {u.email}
                        </div>
                        
                        {/* Display Tasks List */}
                        {u.tasks_listed && u.tasks_listed.length > 0 ? (
                            <ul className="mt-2 pl-8 space-y-2">
                            {u.tasks_listed.map((task, tIndex) => (
                                <li key={tIndex} className="text-xs flex items-center gap-2 text-teal-700 animate-slideInUp" style={{ animationDelay: `${tIndex * 0.05}s` }}>
                                    <FileText size={12} className="text-cyan-600 shrink-0" />
                                    {/* Updated to show Task Name */}
                                    <span className="font-medium text-black">
                                        {task.task || `Task ${tIndex + 1}`}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-bold border ${
                                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 
                                        task.status === 'active' ? 'bg-cyan-100 text-cyan-700 border-cyan-300' :
                                        'bg-gray-100 text-gray-600 border-gray-300'
                                    }`}>
                                        {task.status}
                                    </span>
                                    {task.drive_link && (
                                        <a 
                                        href={task.drive_link} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-cyan-600 hover:text-cyan-800 hover:underline flex items-center gap-0.5 font-bold"
                                        >
                                            View <ExternalLink size={10} />
                                        </a>
                                    )}
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <div className="text-xs text-teal-500 ml-8 italic mt-1">No tasks assigned</div>
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
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-white">
      <div className="relative inline-block mb-10 animate-slideUp">
        <h1 className="text-4xl font-bold text-teal-900">Workflow Projects</h1>
        <div className="absolute left-0 -bottom-2 h-1.5 w-32 bg-linear-to-r from-cyan-500 to-cyan-400 animate-pulse rounded-full"></div>
      </div>

  
      <div className="flex gap-4 mb-10 flex-wrap">
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-br from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-bold"
        >
          <Plus size={18} /> New Project
        </button>

        <button
          onClick={() => setShowJoin(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-bold"
        >
          <LogIn size={18} /> Join Project
        </button>
      </div>


      <h2 className="text-2xl font-bold mb-5 text-teal-900 flex items-center gap-3">
        Created Projects 
        <span className="text-sm font-bold text-white bg-linear-to-r from-cyan-500 to-cyan-600 px-3 py-1 rounded-full shadow-md">{createdProjects.length}</span>
      </h2>
      {createdProjects.length === 0 && (
        <div className="text-teal-600 mb-8 italic bg-cyan-50 p-6 rounded-lg border-2 border-dashed border-cyan-300 text-center font-medium">
            You haven't created any projects yet.
        </div>
      )}
      {createdProjects.map((p) => (
        <ProjectRow key={p._id} project={p} isOwner={true} />
      ))}

      {/* Joined Projects */}
      <h2 className="text-2xl font-bold mt-12 mb-5 text-teal-900 flex items-center gap-3">
        Joined Projects 
        <span className="text-sm font-bold text-white bg-linear-to-r from-emerald-500 to-emerald-600 px-3 py-1 rounded-full shadow-md">{joinedProjects.length}</span>
      </h2>
      {joinedProjects.length === 0 && (
        <div className="text-teal-600 italic bg-cyan-50 p-6 rounded-lg border-2 border-dashed border-cyan-300 text-center font-medium">
            You haven't joined any projects yet.
        </div>
      )}
      {joinedProjects.map((p) => (
        <ProjectRow key={p._id} project={p} isOwner={false} />
      ))}

      {/* Toast */}
      <div className="fixed top-4 right-4 z-9999">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl animate-slideUp border border-cyan-200">
            <h3 className="font-bold mb-3 text-lg text-teal-900">Share Project Link</h3>
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200 mb-4 break-all text-sm text-black font-mono">
                {shareLink || "No link generated"}
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-5 py-2 border-2 border-cyan-400 rounded-lg hover:bg-cyan-50 transition-all text-teal-700 font-bold hover:scale-105" 
                onClick={() => setShareLink("")}
              >
                Close
              </button>
              <button
                className="px-5 py-2 bg-linear-to-br from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 font-bold"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl animate-slideUp border border-cyan-200">
            <h3 className="font-bold mb-3 text-lg text-teal-900">
              {confirmBox.type === "delete" ? "Delete Project?" : "Leave Project?"}
            </h3>
            <p className="text-sm text-black mb-6">
              Are you sure you want to {confirmBox.type === "delete" ? "delete" : "leave"} 
              <span className="font-bold text-teal-900"> {confirmBox.project?.name}</span>? 
              {confirmBox.type === "delete" && " This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 border-2 border-cyan-400 rounded-lg hover:bg-cyan-50 transition-all text-teal-700 font-bold hover:scale-105"
                onClick={() => setConfirmBox({ open: false, type: "", project: null })}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-bold"
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