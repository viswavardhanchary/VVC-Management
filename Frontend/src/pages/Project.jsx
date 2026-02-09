// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getProject, updateProject } from "../services/projectService";
// import Toast from "../components/Toast";
// import { CommentsModal } from "../components/CommentsModal";
// import { LogsModal } from "../components/LogsModal";

// const COLUMNS = ["assigned", "active", "completed", "error", "closed"];

// export function Project() {
//   const { id } = useParams();
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");

//   const [project, setProject] = useState(null);
//   const [toast, setToast] = useState({ message: "", type: "info" });

//   // drag state
//   const ghostRef = useRef(null);
//   const dragItemRef = useRef(null);
//   const offsetRef = useRef({ x: 0, y: 0 });

//   // modals
//   const [showComments, setShowComments] = useState(null); // user object
//   const [showLogs, setShowLogs] = useState(null); // user object

//   async function loadProject() {
//     const res = await getProject(token, id);
//     if (res.success) {
//       setProject(res.data.project);
//     } else {
//       setToast({ message: res.message, type: "error" });
//     }
//   }

//   useEffect(() => {
//     loadProject();
//   }, [id]);

//   if (!project) return <div className="p-6">Loading...</div>;

//   const isOwner = String(project.created_by?._id || project.created_by) === String(userId);

//   // ================= DRAG LOGIC =================

//   function onMouseDown(e, userTask) {
//     // permission
//     if (!isOwner || String(userTask.user_id?._id || userTask.user_id) !== String(userId)) {
//       setToast({ message: "You can move only your task", type: "warning" });
//       return;
//     }

//     dragItemRef.current = userTask;

//     const card = e.currentTarget;
//     const rect = card.getBoundingClientRect();

//     const ghost = card.cloneNode(true);
//     ghost.classList.add("opacity-50", "pointer-events-none", "fixed", "z-50");
//     ghost.style.left = rect.left + "px";
//     ghost.style.top = rect.top + "px";
//     ghost.style.width = rect.width + "px";

//     document.body.appendChild(ghost);
//     ghostRef.current = ghost;

//     offsetRef.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     document.addEventListener("mousemove", onMouseMove);
//     document.addEventListener("mouseup", onMouseUp);
//   }

//   function onMouseMove(e) {
//     if (!ghostRef.current) return;
//     ghostRef.current.style.left = e.clientX - offsetRef.current.x + "px";
//     ghostRef.current.style.top = e.clientY - offsetRef.current.y + "px";
//   }

//   async function onMouseUp(e) {
//     if (!ghostRef.current || !dragItemRef.current) return;

//     const ghost = ghostRef.current;
//     const ghostRect = ghost.getBoundingClientRect();

//     let newStatus = null;

//     document.querySelectorAll("[data-column]").forEach((col) => {
//       const rect = col.getBoundingClientRect();
//       if (
//         ghostRect.left > rect.left &&
//         ghostRect.right < rect.right &&
//         ghostRect.top > rect.top &&
//         ghostRect.bottom < rect.bottom
//       ) {
//         newStatus = col.dataset.column;
//       }
//     });

//     if (newStatus && newStatus !== dragItemRef.current.status) {
//       await moveTask(dragItemRef.current, newStatus);
//     }

//     ghost.remove();
//     ghostRef.current = null;
//     dragItemRef.current = null;

//     document.removeEventListener("mousemove", onMouseMove);
//     document.removeEventListener("mouseup", onMouseUp);
//   }

//   async function moveTask(task, toStatus) {
//     const fromStatus = task.status;

//     const updateLog = {
//       from: fromStatus,
//       to: toStatus,
//       date: new Date(),
//     };

//     const updatedUsers = project.users_added.map((u) => {
//       if (u === task) {
//         return {
//           ...u,
//           status: toStatus,
//           updates: [...(u.updates || []), updateLog],
//         };
//       }
//       return u;
//     });

//     const res = await updateProject(token, project._id, { users_added: updatedUsers });
//     if (res.success) {
//       setToast({ message: "Task moved", type: "success" });
//       loadProject();
//     } else {
//       setToast({ message: res.message, type: "error" });
//     }
//   }

//   // ================= UI =================

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">{project.name}</h1>

//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         {COLUMNS.map((col) => (
//           <div
//             key={col}
//             data-column={col}
//             className="bg-gray-100 rounded-lg p-3 min-h-[400px]"
//           >
//             <h2 className="font-semibold capitalize mb-3">{col}</h2>

//             {project.users_added
//               .filter((u) => u.status === col)
//               .map((u, i) => (
//                 <div
//                   key={i}
//                   onMouseDown={(e) => onMouseDown(e, u)}
//                   className="bg-white rounded-lg p-3 mb-3 shadow cursor-grab active:cursor-grabbing"
//                 >
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
//                       {u.email?.[0]?.toUpperCase()}
//                     </div>
//                     <div className="text-sm font-semibold">{u.email}</div>
//                   </div>

//                   <div className="text-sm mb-2">{u.tasks}</div>

//                   <div className="flex gap-3 text-xs text-blue-600">
//                     <button onClick={() => setShowComments(u)}>Comments</button>
//                     <button onClick={() => setShowLogs(u)}>Logs</button>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         ))}
//       </div>

//       {/* Toast */}
//       <div className="fixed top-4 right-4 w-96 z-50">
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ message: "", type: "info" })}
//         />
//       </div>

//       {/* Comments Modal */}
//       {showComments && (
//         <CommentsModal
//           task={showComments}
//           project={project}
//           onClose={() => setShowComments(null)}
//           onSaved={loadProject}
//         />
//       )}

//       {/* Logs Modal */}
//       {showLogs && (
//         <LogsModal task={showLogs} onClose={() => setShowLogs(null)} />
//       )}
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getProject, updateProject } from "../services/projectService";
import Toast from "../components/Toast";
import { CommentsModal } from "../components/CommentsModal";
import { LogsModal } from "../components/LogsModal";

const COLUMNS = ["assigned", "active", "completed", "error", "closed"];

export function Project() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [project, setProject] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "info" });

  // drag state
  const ghostRef = useRef(null);
  const dragItemRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // modals
  const [showComments, setShowComments] = useState(null);
  const [showLogs, setShowLogs] = useState(null);

  async function loadProject() {
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

  if (!project) return <div className="p-6">Loading...</div>;

  const isOwner =
    String(project.created_by?._id || project.created_by) === String(userId);

  // ================= DRAG LOGIC =================

  function onMouseDown(e, userTask) {
    // permission
    if (
      !isOwner ||
      String(userTask.user_id?._id || userTask.user_id) !== String(userId)
    ) {
      setToast({ message: "You can move only your task", type: "warning" });
      return;
    }

    e.preventDefault(); // stop text selection start
    document.body.style.userSelect = "none"; // disable selection globally

    dragItemRef.current = userTask;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const ghost = card.cloneNode(true);
    ghost.classList.add("opacity-70", "pointer-events-none", "fixed", "z-50");
    ghost.style.left = rect.left + "px";
    ghost.style.top = rect.top + "px";
    ghost.style.width = rect.width + "px";

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

    document.body.style.userSelect = ""; // re-enable selection

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  async function moveTask(task, toStatus) {
    const fromStatus = task.status;

    const updateLog = {
      from: fromStatus,
      to: toStatus,
      date: new Date(),
    };

    const updatedUsers = project.users_added.map((u) => {
      if (u === task) {
        return {
          ...u,
          status: toStatus,
          updates: [...(u.updates || []), updateLog],
        };
      }
      return u;
    });

    const res = await updateProject(token, project._id, {
      users_added: updatedUsers,
    });

    if (res.success) {
      setToast({ message: "Task moved", type: "success" });
      loadProject();
    } else {
      setToast({ message: res.message, type: "error" });
    }
  }

  // ================= UI =================

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col}
            data-column={col}
            className="bg-gray-100 rounded-lg p-3 min-h-[400px]"
          >
            <h2 className="font-semibold capitalize mb-3">{col}</h2>

            {project.users_added
              .filter((u) => u.status === col)
              .map((u, i) => (
                <div
                  key={i}
                  onMouseDown={(e) => onMouseDown(e, u)}
                  className="bg-white rounded-lg p-3 mb-3 shadow cursor-grab active:cursor-grabbing select-none"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {u.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="text-sm font-semibold">{u.email}</div>
                  </div>

                  <div className="text-sm mb-2">{u.tasks}</div>

                  <div className="flex gap-3 text-xs text-blue-600">
                    <button onClick={() => setShowComments(u)}>Comments</button>
                    <button onClick={() => setShowLogs(u)}>Logs</button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Toast */}
      <div className="fixed top-4 right-4 w-96 z-50">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "info" })}
        />
      </div>

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal
          task={showComments}
          project={project}
          onClose={() => setShowComments(null)}
          onSaved={loadProject}
        />
      )}

      {/* Logs Modal */}
      {showLogs && (
        <LogsModal task={showLogs} onClose={() => setShowLogs(null)} />
      )}
    </div>
  );
}

