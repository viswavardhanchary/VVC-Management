import React, { useState } from "react";
import { X } from "lucide-react";
import { getProjects, updateProject } from "../services/projectService";
import Toast from "./Toast";

export default function JoinProjectModal({ onClose }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ message: "", type: "info" });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  function onToast(msg,type) {
    setToast({ message: msg, type })
  }

  async function handleJoin() {
    const res = await getProjects(token);
    if (!res.success) return onToast("Failed to fetch projects", "error");

    const project = res.data.projects.find(
      (p) => p.name === name && p.password === password
    );
    console.log(project);

    if (!project) return onToast("Project not found or wrong password", "error");

    const userEntry = project.users_added.find((u) => u.email === email);
    if (!userEntry) return onToast("Email not found in project", "error");
    console.log(userEntry)
    // Assign user_id
    userEntry.user_id = userId;

    await updateProject(token, project._id, { users_added: project.users_added });

    onToast("Joined project successfully!", "success");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Join Project</h2>
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

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleJoin}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
