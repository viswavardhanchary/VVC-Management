// import React, { useState } from "react";
// import { X, Eye, EyeOff, Plus, Trash } from "lucide-react";
// import { createProject, updateProject } from "../services/projectService";
// import { WEBSITE_BASE_URL } from "../utils/constants";
// import Toast from "./Toast";

// export default function NewProjectModal({ onClose,editData }) {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [toast, setToast] = useState({ message: "", type: "info" });

//   const [users, setUsers] = useState([
//     { email: "", tasks: "", date: "" },
//   ]);

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");

//   function onToast(msg,type) {
//     setToast({ message: msg, type })
//   }

//   function addUserRow() {
//     setUsers([...users, { email: "", tasks: "", date: "" }]);
//   }

//   function removeUserRow(index) {
//     setUsers(users.filter((_, i) => i !== index));
//   }

//   function updateUserField(index, field, value) {
//     const copy = [...users];
//     copy[index][field] = value;
//     setUsers(copy);
//   }

//   async function handleCreate() {
//     if (!name) return onToast("Project name required", "error");

//     const update = {
//       from: "assigned",
//       to: "assigned",
//       date: new Date(),
//     };

//     const comments = {
//       by_creator: [""],
//       by_others: [""],
//       by_user: [""],
//     };

//     const users_added = users.map((u) => ({
//       user_id: null,
//       email: u.email,
//       tasks: u.tasks,
//       drive_link: "",
//       status: "assigned",
//       date_to_completed: u.date,
//       comments,
//       updates: [update],
//     }));

//     const payload = {
//       name,
//       password,
//       link: "",
//       created_by: userId,
//       users_added,
//     };

//     const res = await createProject(token, payload);
//     if (!res.success) return onToast(res.message, "error");
//     console.log(res);

//     const projectId = res.data.project._id;


//     const link = `${API_BASE_URL}project/${projectId}`;
//     await updateProject(token, projectId, { link });

//     onToast("Project created successfully!", "success");
//     onClose();
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative">
//         <button onClick={onClose} className="absolute top-3 right-3">
//           <X />
//         </button>

//         <h2 className="text-xl font-bold mb-4">Create New Project</h2>

//         <div className="fixed top-4 right-4 w-96 z-50">
//           <Toast
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast({ message: "", type: "info" })}
//           />
//         </div>


//         <input
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Project Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />


//         <div className="relative mb-4">
//           <input
//             className="w-full border p-2 rounded pr-10"
//             type={showPass ? "text" : "password"}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPass(!showPass)}
//             className="absolute right-2 top-2"
//           >
//             {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>


//         <div className="overflow-auto h-50 space-y-3">
//           {users.map((u, i) => (
//             <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2">
//               <input
//                 className="border p-2 rounded"
//                 placeholder="Email"
//                 value={u.email}
//                 onChange={(e) => updateUserField(i, "email", e.target.value)}
//               />
//               <input
//                 className="border p-2 rounded"
//                 placeholder="Task"
//                 value={u.tasks}
//                 onChange={(e) => updateUserField(i, "tasks", e.target.value)}
//               />
//               <input
//                 type="date"
//                 className="border p-2 rounded"
//                 value={u.date}
//                 onChange={(e) => updateUserField(i, "date", e.target.value)}
//               />
//               <button
//                 onClick={() => removeUserRow(i)}
//                 className="bg-red-100 text-red-600 rounded flex items-center justify-center"
//               >
//                 <Trash size={18} />
//               </button>
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={addUserRow}
//           className="mt-3 flex items-center gap-2 text-blue-600"
//         >
//           <Plus size={18} /> Add another email
//         </button>

//         <div className="mt-6 flex justify-end gap-3">
//           <button onClick={onClose} className="px-4 py-2 border rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleCreate}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, Plus, Trash } from "lucide-react";
import { createProject, updateProject } from "../services/projectService";
import { WEBSITE_BASE_URL } from "../utils/constants";
import Toast from "./Toast";

export default function NewProjectModal({ onClose, editData }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const [users, setUsers] = useState([{ email: "", tasks: "", date: "" }]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  function onToast(msg, type) {
    setToast({ message: msg, type });
  }

  // 🔹 If editData is present, pre-fill the form
  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setPassword(editData.password || "");

      if (editData.users_added && editData.users_added.length > 0) {
        setUsers(
          editData.users_added.map((u) => ({
            email: u.email || "",
            tasks: u.tasks || "",
            date: u.date_to_completed
              ? new Date(u.date_to_completed).toISOString().slice(0, 10)
              : "",
          }))
        );
      }
    }
  }, [editData]);

  function addUserRow() {
    setUsers([...users, { email: "", tasks: "", date: "" }]);
  }

  function removeUserRow(index) {
    setUsers(users.filter((_, i) => i !== index));
  }

  function updateUserField(index, field, value) {
    const copy = [...users];
    copy[index][field] = value;
    setUsers(copy);
  }

  async function handleSubmit() {
    if (!name) return onToast("Project name required", "error");

    const update = {
      from: "assigned",
      to: "assigned",
      date: new Date(),
    };

    const comments = {
      by_creator: [{}],
      by_others: [{}],
      by_user: [{}],
    };

    const users_added = users.map((u) => ({
      user_id: null,
      email: u.email,
      tasks: u.tasks,
      drive_link: "",
      status: "assigned",
      date_to_completed: u.date,
      comments,
      updates: [update],
    }));

    const payload = {
      name,
      password,
      created_by: userId,
      users_added,
    };

    try {
      // 🔹 EDIT MODE
      if (editData && editData._id) {
        const res = await updateProject(token, editData._id, payload);
        if (!res.success) return onToast(res.message, "error");

        onToast("Project updated successfully!", "success");
        onClose();
        return;
      }

      // 🔹 CREATE MODE
      const res = await createProject(token, payload);
      if (!res.success) return onToast(res.message, "error");
      console.log(res);
      const projectId = res.data.project._id;
      const link = `${WEBSITE_BASE_URL}project/${projectId}`;
      
      const respone2 = await updateProject(token, projectId, { link });
      console.log(respone2);

      onToast("Project created successfully!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      onToast("Something went wrong", "error");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Project" : "Create New Project"}
        </h2>

        <div className="fixed top-4 right-4 w-96 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "info" })}
          />
        </div>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            className="w-full border p-2 rounded pr-10"
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-2 top-2"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <h1 className="font-bold text-xl mb-2">Team Details: </h1>
        <div className="overflow-auto max-h-42 space-y-3">
          {users.map((u, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                className="border p-2 rounded"
                placeholder="Email"
                value={u.email}
                onChange={(e) => updateUserField(i, "email", e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Task"
                value={u.tasks}
                onChange={(e) => updateUserField(i, "tasks", e.target.value)}
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={u.date}
                onChange={(e) => updateUserField(i, "date", e.target.value)}
              />
              <button
                onClick={() => removeUserRow(i)}
                className="bg-red-100 text-red-600 rounded flex items-center justify-center"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addUserRow}
          className="mt-3 flex items-center gap-2 text-blue-600"
        >
          <Plus size={18} /> Add another email
        </button>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
