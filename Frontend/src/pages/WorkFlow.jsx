// import  { useEffect, useState } from "react";
// import { Plus, LogIn, Eye, Pencil, Trash2, Share2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import NewProjectModal from "../components/NewProjectModal";
// import JoinProjectModal from "../components/JoinProjectModal";
// import Toast from "../components/Toast";
// import { getProjects, deleteProject, updateProject } from "../services/projectService";

// export function WorkFlow() {
//   const [showNew, setShowNew] = useState(false);
//   const [showJoin, setShowJoin] = useState(false);
//   const [toast, setToast] = useState({ message: "", type: "info" });
//   const [projects, setProjects] = useState([]);
//   const [expandedId, setExpandedId] = useState(null);
//   const [editProject, setEditProject] = useState(null);
//   const [shareLink, setShareLink] = useState("");

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");
//   const navigate = useNavigate();

//   async function loadProjects() {
//     const res = await getProjects(token);
//     if (res.success) {
//       setProjects(res.data.projects || []);
//     } else {
//       setToast({ message: res.message, type: "error" });
//     }
//   }

//   useEffect(() => {
//     loadProjects();
//   }, []);

//   const createdProjects = projects.filter(p => String(p.created_by?._id || p.created_by) === String(userId));
//   const joinedProjects = projects.filter(p =>
//     p.users_added?.some(u => String(u.user_id?._id || u.user_id) === String(userId))
//   );

//   async function handleDelete(projectId) {
//     if (!window.confirm("Are you sure you want to delete this project?")) return;

//     const res = await deleteProject(token, projectId);
//     if (res.success) {
//       setToast({ message: "Project deleted", type: "success" });
//       loadProjects();
//     } else {
//       setToast({ message: res.message, type: "error" });
//     }
//   }

//   async function handleLeave(project) {
//     if (!window.confirm("Are you sure you want to leave this project?")) return;

//     const newUsers = project.users_added.filter(
//       u => String(u.user_id?._id || u.user_id) !== String(userId)
//     );

//     const res = await updateProject(token, project._id, { users_added: newUsers });
//     if (res.success) {
//       setToast({ message: "You left the project", type: "success" });
//       loadProjects();
//     } else {
//       setToast({ message: res.message, type: "error" });
//     }
//   }

//   function ProjectRow({ project, isOwner }) {
//     const isOpen = expandedId === project._id;

//     return (
//       <div className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
//         <div className="flex justify-between items-center">
//           <div className="font-semibold">{project.name}</div>

//           <div className="flex items-center gap-3">
//             <button onClick={() => setExpandedId(isOpen ? null : project._id)}>
//               {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//             </button>

//             <button title="View" onClick={() => setExpandedId(isOpen ? null : project._id)}>
//               <Eye size={18} />
//             </button>

//             {isOwner && (
//               <>
//                 <button title="Edit" onClick={() => setEditProject(project)}>
//                   <Pencil size={18} />
//                 </button>
//                 <button title="Delete" onClick={() => handleDelete(project._id)}>
//                   <Trash2 size={18} className="text-red-600" />
//                 </button>
//                 <button title="Share" onClick={() => setShareLink(project.link)}>
//                   <Share2 size={18} />
//                 </button>
//               </>
//             )}

//             {!isOwner && (
//               <button
//                 className="text-red-600 text-sm"
//                 onClick={() => handleLeave(project)}
//               >
//                 Leave Group
//               </button>
//             )}

//             <button
//               className="flex items-center gap-1 text-blue-600"
//               onClick={() => navigate(`/project/${project._id}`, { state: project })}
//             >
//               Open <ExternalLink size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Dropdown Details */}
//         <div
//           className={`transition-all overflow-hidden ${
//             isOpen ? "max-h-[500px] mt-4" : "max-h-0"
//           }`}
//         >
//           {isOpen && (
//             <div className="text-sm space-y-2">
//               <div><b>Name:</b> {project.name}</div>
//               <div><b>Password:</b> {project.password || "—"}</div>
//               <div><b>Link:</b> {project.link || "—"}</div>
//               <div><b>Creator:</b> {project.created_by?.name || project.created_by}</div>

//               <div>
//                 <b>Users:</b>
//                 <ul className="list-disc ml-6">
//                   {project.users_added?.map((u, i) => (
//                     <li key={i}>
//                       {u.email} — Task: {u.tasks}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="relative inline-block mb-10">
//         <h1 className="text-3xl font-bold">Work Flow</h1>
//         <div className="absolute left-0 -bottom-2 h-1 w-full bg-blue-500 animate-pulse"></div>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4 mb-10">
//         <button
//           onClick={() => setShowNew(true)}
//           className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//         >
//           <Plus size={18} /> New Project
//         </button>

//         <button
//           onClick={() => setShowJoin(true)}
//           className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
//         >
//           <LogIn size={18} /> Join Project
//         </button>
//       </div>

//       {/* Created Projects */}
//       <h2 className="text-xl font-semibold mb-4">Created Projects</h2>
//       {createdProjects.length === 0 && <div className="text-gray-500 mb-6">No created projects</div>}
//       {createdProjects.map(p => (
//         <ProjectRow key={p._id} project={p} isOwner={true} />
//       ))}

//       {/* Joined Projects */}
//       <h2 className="text-xl font-semibold mt-10 mb-4">Joined Projects</h2>
//       {joinedProjects.length === 0 && <div className="text-gray-500">No joined projects</div>}
//       {joinedProjects.map(p => (
//         <ProjectRow key={p._id} project={p} isOwner={false} />
//       ))}

//       {/* Toast */}
//       <div className="fixed top-4 right-4 w-96 z-50">
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ message: "", type: "info" })}
//         />
//       </div>

//       {/* Modals */}
//       {showNew && (
//         <NewProjectModal
//           onClose={() => {
//             setShowNew(false);
//             loadProjects();
//           }}
//         />
//       )}

//       {showJoin && (
//         <JoinProjectModal
//           onClose={() => {
//             setShowJoin(false);
//             loadProjects();
//           }}
//         />
//       )}

//       {editProject && (
//         <NewProjectModal
//           editData={editProject}
//           onClose={() => {
//             setEditProject(null);
//             loadProjects();
//           }}
//         />
//       )}


//       {shareLink && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md">
//             <h3 className="font-semibold mb-3">Share Project Link</h3>
//             <input
//               className="w-full border p-2 rounded mb-3"
//               value={shareLink}
//               readOnly
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 className="px-4 py-2 border rounded"
//                 onClick={() => setShareLink("")}
//               >
//                 Close
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//                 onClick={() => {
//                   navigator.clipboard.writeText(shareLink);
//                   setToast({ message: "Link copied!", type: "success" });
//                 }}
//               >
//                 Copy
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewProjectModal from "../components/NewProjectModal";
import JoinProjectModal from "../components/JoinProjectModal";
import Toast from "../components/Toast";
import { getProjects, deleteProject, updateProject } from "../services/projectService";

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
    const newUsers = project.users_added.filter(
      (u) => String(u.user_id?._id || u.user_id) !== String(userId)
    );

    const res = await updateProject(token, project._id, { users_added: newUsers });
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
      <div className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <div className="font-semibold">{project.name}</div>

          <div className="flex items-center gap-3">
            {/* Arrow toggle */}
            <button onClick={() => setExpandedId(isOpen ? null : project._id)}>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Owner actions */}
            {isOwner && (
              <>
                <button title="Edit" onClick={() => setEditProject(project)}>
                  <Pencil size={18} />
                </button>
                <button
                  title="Delete"
                  onClick={() =>
                    setConfirmBox({ open: true, type: "delete", project })
                  }
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
                <button title="Share" onClick={() => setShareLink(project.link)}>
                  <Share2 size={18} />
                </button>
              </>
            )}

            {/* Joined project actions */}
            {!isOwner && (
              <button
                className="text-red-600 text-sm"
                onClick={() =>
                  setConfirmBox({ open: true, type: "leave", project })
                }
              >
                Leave Group
              </button>
            )}

            {/* Open */}
            <button
              className="flex items-center gap-1 text-blue-600"
              onClick={() => navigate(`/project/${project._id}`, { state: project })}
            >
              Open <ExternalLink size={16} />
            </button>
          </div>
        </div>


        <div
          className={`transition-all overflow-hidden ${
            isOpen ? "max-h-[500px] mt-4" : "max-h-0"
          }`}
        >
          {isOpen && (
            <div className="text-sm space-y-2">
              <div><b>Name:</b> {project.name}</div>
              <div><b>Password:</b> {project.password || "—"}</div>
              <div><b>Link:</b> {project.link || "—"}</div>
              <div><b>Creator:</b> {project.created_by?.name || project.created_by}</div>

              <div>
                <b>Users:</b>
                <ul className="list-disc ml-6">
                  {project.users_added?.map((u, i) => (
                    <li key={i}>
                      {u.email} — Task: {u.tasks}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="relative inline-block mb-10">
        <h1 className="text-3xl font-bold">Work Flow</h1>
        <div className="absolute left-0 -bottom-2 h-1 w-full bg-blue-500 animate-pulse"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus size={18} /> New Project
        </button>

        <button
          onClick={() => setShowJoin(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <LogIn size={18} /> Join Project
        </button>
      </div>

      {/* Created Projects */}
      <h2 className="text-xl font-semibold mb-4">Created Projects</h2>
      {createdProjects.length === 0 && (
        <div className="text-gray-500 mb-6">No created projects</div>
      )}
      {createdProjects.map((p) => (
        <ProjectRow key={p._id} project={p} isOwner={true} />
      ))}

      {/* Joined Projects */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Joined Projects</h2>
      {joinedProjects.length === 0 && (
        <div className="text-gray-500">No joined projects</div>
      )}
      {joinedProjects.map((p) => (
        <ProjectRow key={p._id} project={p} isOwner={false} />
      ))}

      {/* Toast */}
      <div className="fixed top-4 right-4 w-96 z-50">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="font-semibold mb-3">Share Project Link</h3>
            <input className="w-full border p-2 rounded mb-3" value={shareLink} readOnly />
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 border rounded" onClick={() => setShareLink("")}>
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  setToast({ message: "Link copied!", type: "success" });
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmBox.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="font-semibold mb-4">
              {confirmBox.type === "delete"
                ? "Delete Project?"
                : "Leave Project?"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              {confirmBox.type === "delete" ? "delete" : "leave"} this project?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setConfirmBox({ open: false, type: "", project: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
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

