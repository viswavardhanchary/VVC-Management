import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, Plus, Trash, User, FileText } from "lucide-react";
import { createProject, updateProject } from "../services/projectService";
import { WEBSITE_BASE_URL } from "../utils/constants";
import Toast from "./Toast";

export default function NewProjectModal({ onClose, editData }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [instructions, setInstructions] = useState("");

  // 🔹 State Structure: Array of Users, where each User has an Array of Tasks
  // Changed 'link' to 'taskName' to match your new schema logic (Admin assigns a Task Name)
  const [users, setUsers] = useState([
    { 
      email: "", 
      tasks: [{ taskName: "", date: "" }] 
    }
  ]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  function onToast(msg, type) {
    setToast({ message: msg, type });
  }

  // 🔹 Populate Form in Edit Mode
  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setPassword(editData.password || "");
      setInstructions(editData.instructions || "");

      if (editData.users_added && editData.users_added.length > 0) {
        setUsers(
          editData.users_added.map((u) => ({
            email: u.email || "",
            // Map the nested tasks_listed array
            tasks: (u.tasks_listed && u.tasks_listed.length > 0) 
              ? u.tasks_listed.map(t => ({
                  // Map database 'task' field to our 'taskName' state
                  taskName: t.task || "", 
                  date: t.date_to_completed
                    ? new Date(t.date_to_completed).toISOString().slice(0, 10)
                    : ""
                }))
              : [{ taskName: "", date: "" }]
          }))
        );
      }
    }
  }, [editData]);

  // --- User Management ---
  function addUserBlock() {
    setUsers([...users, { email: "", tasks: [{ taskName: "", date: "" }] }]);
  }

  function removeUserBlock(index) {
    setUsers(users.filter((_, i) => i !== index));
  }

  function updateUserEmail(index, value) {
    const copy = [...users];
    copy[index].email = value;
    setUsers(copy);
  }

  // --- Task Management (Nested) ---
  function addTaskToUser(userIndex) {
    const copy = [...users];
    copy[userIndex].tasks.push({ taskName: "", date: "" });
    setUsers(copy);
  }

  function removeTaskFromUser(userIndex, taskIndex) {
    const copy = [...users];
    copy[userIndex].tasks = copy[userIndex].tasks.filter((_, i) => i !== taskIndex);
    setUsers(copy);
  }

  function updateTaskField(userIndex, taskIndex, field, value) {
    const copy = [...users];
    copy[userIndex].tasks[taskIndex][field] = value;
    setUsers(copy);
  }

  async function handleSubmit() {
    if (!name) return onToast("Project name required", "error");

    // 🔹 Format Payload to match Schema
    const users_added = users.map((u) => {
      const tasks_listed = u.tasks.map(t => ({
        // 1. Assign input to 'task' (The instruction)
        task: t.taskName, 
        // 2. Initialize 'drive_link' as empty (User will fill this later)
        drive_link: "", 
        status: "assigned", 
        date_to_completed: t.date || null,
        comments: {},
        updates: [{
            from: "assigned",
            to: "assigned",
            date: new Date(),
        }]
      }));

      return {
        user_id: null,
        email: u.email,
        tasks_listed: tasks_listed,
        instructions: "", 
      };
    });

    const payload = {
      name,
      password,
      created_by: userId,
      users_added,
      instructions
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
      
      const projectId = res.data.project._id;
      const link = `${WEBSITE_BASE_URL}project/${projectId}`;
      await updateProject(token, projectId, { link });

      onToast("Project created successfully!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      onToast("Something went wrong", "error");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp border border-cyan-100/50" style={{
        boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.1), 0 4px 6px -2px rgba(6, 182, 212, 0.05)'
      }}>
        
        {/* Header */}
        <div className="p-4 border-b border-cyan-200 bg-linear-to-r from-white to-cyan-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-teal-900">
            {editData ? "Edit Project" : "Create New Project"}
          </h2>
          <button onClick={onClose} className="text-cyan-600 hover:text-red-500 transition-all duration-200 hover:scale-110 hover:bg-red-50 p-1 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-white">
          {/* Toast Notification */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-110 w-full max-w-md">
             <Toast
               message={toast.message}
               type={toast.type}
               onClose={() => setToast({ message: "", type: "info" })}
             />
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-blackmb-2">Project Name</label>
              <input
                className="w-full border-2 border-cyan-200 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white text-blackplaceholder-cyan-400 transition-all duration-200"
                placeholder="e.g. Website Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-bold text-blackmb-2">Password (Optional)</label>
              <div className="relative">
                <input
                  className="w-full border-2 border-cyan-200 p-3 rounded-lg pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white text-blackplaceholder-cyan-400 transition-all duration-200"
                  type={showPass ? "text" : "password"}
                  placeholder="Secret123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-cyan-600 hover:text-cyan-700 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Users & Tasks Section */}
          <div className="mb-4 flex justify-between items-center">
             <h3 className="font-bold text-lg text-teal-900">Assign Users & Tasks</h3>
             <button
                onClick={addUserBlock}
                className="text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-1 hover:from-cyan-500 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl border border-cyan-600 hover:scale-105"
              >
                <Plus size={16} /> Add User
              </button>
          </div>

          <div className="space-y-6">
            {users.map((u, userIndex) => (
              <div key={userIndex} className="border-2 border-cyan-200 rounded-xl p-4 bg-cyan-50/40 shadow-md hover:shadow-lg transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50/60 animate-slideInUp" style={{ animationDelay: `${userIndex * 0.1}s` }}>
                
                {/* User Header (Email + Remove) */}
                <div className="flex gap-3 mb-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-cyan-600" size={16} />
                        <input
                            className="w-full border-2 border-cyan-200 pl-9 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-blackplaceholder-cyan-400 transition-all duration-200 bg-white"
                            placeholder="User Email"
                            value={u.email}
                            onChange={(e) => updateUserEmail(userIndex, e.target.value)}
                        />
                    </div>
                  </div>
                  <button
                    onClick={() => removeUserBlock(userIndex)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Remove User"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                {/* Tasks List for this User */}
                <div className="pl-4 border-l-3 border-cyan-400 ml-2 space-y-3">
                    {u.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex gap-2 items-center animate-slideInUp" style={{ animationDelay: `${(userIndex + taskIndex) * 0.05}s` }}>
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                {/* Task Name Input */}
                                <div className="col-span-2 relative">
                                    <FileText className="absolute left-3 top-3 text-cyan-600" size={14} />
                                    <input
                                        className="w-full border-2 border-cyan-200 pl-8 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-blackplaceholder-cyan-400 transition-all duration-200 bg-white"
                                        placeholder="Task Description (e.g. Design Home Page)"
                                        value={task.taskName}
                                        onChange={(e) => updateTaskField(userIndex, taskIndex, 'taskName', e.target.value)}
                                    />
                                </div>
                                {/* Date Input */}
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full border-2 border-cyan-200 p-2.5 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-blacktransition-all duration-200 bg-white"
                                        value={task.date}
                                        onChange={(e) => updateTaskField(userIndex, taskIndex, 'date', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {/* Remove Task Button (Only if more than 1 task) */}
                            {u.tasks.length > 1 && (
                                <button
                                    onClick={() => removeTaskFromUser(userIndex, taskIndex)}
                                    className="text-red-400 hover:text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 p-1 rounded"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add Task Button */}
                    <button
                        onClick={() => addTaskToUser(userIndex)}
                        className="text-xs flex items-center gap-1 text-emerald-700 font-bold hover:text-emerald-800 transition-all duration-200 hover:scale-105 mt-2 bg-emerald-100 hover:bg-emerald-200 px-3 py-2 rounded-lg"
                    >
                        <Plus size={14} /> Add another task
                    </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-cyan-200 bg-cyan-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border-2 border-cyan-400 rounded-lg bg-white hover:bg-cyan-50 transition-all duration-200 text-teal-700 font-bold hover:shadow-md hover:scale-105">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-bold"
          >
            {editData ? "Update Project" : "Create Project"}
          </button>
        </div>

      </div>
    </div>
  );
}