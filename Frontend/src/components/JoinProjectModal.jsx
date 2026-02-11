// import React, { useState } from "react";
// import { X } from "lucide-react";
// import { getProjects, updateProject } from "../services/projectService";
// import Toast from "./Toast";

// export default function JoinProjectModal({ onClose }) {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [toast, setToast] = useState({ message: "", type: "info" });

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");

//   function onToast(msg,type) {
//     setToast({ message: msg, type })
//   }

//   async function handleJoin() {
//     const res = await getProjects(token);
//     if (!res.success) return onToast("Failed to fetch projects", "error");

//     const project = res.data.projects.find(
//       (p) => p.name === name && p.password === password
//     );
//     console.log(project);

//     if (!project) return onToast("Project not found or wrong password", "error");

//     const userEntry = project.users_added.find((u) => u.email === email);
//     if (!userEntry) return onToast("Email not found in project", "error");
//     console.log(userEntry)
//     // Assign user_id
//     userEntry.user_id = userId;

//     await updateProject(token, project._id, { users_added: project.users_added });

//     onToast("Joined project successfully!", "success");
//     onClose();
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
//         <button onClick={onClose} className="absolute top-3 right-3">
//           <X />
//         </button>

//         <h2 className="text-xl font-bold mb-4">Join Project</h2>
//         <div className="fixed top-4 right-4 w-96 z-50">
//                 <Toast
//                   message={toast.message}
//                   type={toast.type}
//                   onClose={() => setToast({ message: "", type: "info" })}
//                 />
//               </div>

//         <input
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Project Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <input
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <input
//           className="w-full border p-2 rounded mb-4"
//           placeholder="Your Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <div className="flex justify-end gap-3">
//           <button onClick={onClose} className="px-4 py-2 border rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleJoin}
//             className="px-4 py-2 bg-emerald-600 text-white rounded"
//           >
//             Join
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { getProjects, updateProject } from "../services/projectService";
import Toast from "./Toast";

export default function JoinProjectModal({ onClose }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [toast, setToast] = useState({ message: "", type: "info" });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  function onToast(msg, type) {
    setToast({ message: msg, type });
  }

  async function handleJoin() {
    // Basic Validation
    if (!name.trim() || !password.trim() || !email.trim()) {
      return onToast("Please fill in all fields", "error");
    }

    setLoading(true);

    try {
      // 1. Fetch all projects
      const res = await getProjects(token);
      if (!res.success) {
        setLoading(false);
        return onToast("Failed to fetch projects", "error");
      }

      // 2. Find matching project (Name & Password)
      const project = res.data.projects.find(
        (p) => p.name.trim() === name.trim() && p.password === password
      );

      if (!project) {
        setLoading(false);
        return onToast("Project not found or wrong password", "error");
      }

      // 3. Find the user's email within that project
      const userEntry = project.users_added.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!userEntry) {
        setLoading(false);
        return onToast("Your email is not listed in this project", "error");
      }

      if (userEntry.user_id && userEntry.user_id !== userId) {
        setLoading(false);
        return onToast("This email is already claimed by another user", "error");
      }

      // 4. Assign user_id to the entry
      userEntry.user_id = userId;

      // 5. Update the project with the modified users list
      // Note: This preserves the new 'tasks_listed' structure automatically
      // because we are sending back the object we just retrieved.
      const updateRes = await updateProject(token, project._id, { 
        users_added: project.users_added 
      });

      if (updateRes.success) {
        onToast("Joined project successfully!", "success");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        onToast(updateRes.message || "Failed to join", "error");
      }

    } catch (err) {
      console.error(err);
      onToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl animate-slideUp border border-cyan-200" style={{
        boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.1), 0 4px 6px -2px rgba(6, 182, 212, 0.05)'
      }}>
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-cyan-600 hover:text-red-500 transition-all duration-200 hover:scale-110 hover:bg-red-50 p-1 rounded-full"
          disabled={loading}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-teal-900">Join Existing Project</h2>
        
        {/* Toast Container */}
        <div className="absolute top-2 left-0 w-full flex justify-center pointer-events-none">
           <div className="pointer-events-auto">
             <Toast
               message={toast.message}
               type={toast.type}
               onClose={() => setToast({ message: "", type: "info" })}
             />
           </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-teal-900 mb-2">Project Name</label>
            <input
              className="w-full border-2 border-cyan-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white text-black placeholder-cyan-400 transition-all duration-200"
              placeholder="Enter exact project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-teal-900 mb-2">Password</label>
             <input
              className="w-full border-2 border-cyan-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white text-black placeholder-cyan-400 transition-all duration-200"
              placeholder="Enter project password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-teal-900 mb-2">Your Email</label>
             <input
              className="w-full border-2 border-cyan-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white text-black placeholder-cyan-400 transition-all duration-200"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-teal-600 mt-2 font-medium">
              You must use the email address the project creator assigned to you.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="px-5 py-2 border-2 border-cyan-400 rounded-lg bg-white hover:bg-cyan-50 text-teal-700 font-bold transition-all duration-200 hover:shadow-md hover:scale-105"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-300 disabled:to-emerald-400 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed font-bold"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Join Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
