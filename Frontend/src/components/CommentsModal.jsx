import { useState } from "react";
import { updateProject } from "../services/projectService";

export function CommentsModal({ task, project, onClose, onSaved }) {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [text, setText] = useState("");

  async function addComment() {
    const newComment = {
      name: "You",
      text,
      last_edited: new Date(),
    };

    const updatedUsers = project.users_added.map((u) => {
      if (u === task) {
        return {
          ...u,
          comments: {
            ...u.comments,
            by_user: [...(u.comments.by_user || []), newComment],
          },
        };
      }
      return u;
    });

    await updateProject(token, project._id, { users_added: updatedUsers });
    setText("");
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h3 className="font-semibold mb-4">Comments</h3>

        <div className="max-h-64 overflow-auto space-y-2 mb-4">
          {[...(task.comments?.by_creator || []), ...(task.comments?.by_others || []), ...(task.comments?.by_user || [])].map(
            (c, i) => (
              <div key={i} className="border p-2 rounded text-sm">
                <div className="font-semibold">{c.name}</div>
                <div>{c.text}</div>
                <div className="text-xs text-gray-500">
                  {new Date(c.last_edited).toLocaleString()}
                </div>
              </div>
            )
          )}
        </div>

        <textarea
          className="w-full border p-2 rounded mb-3"
          placeholder="Add comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border rounded" onClick={onClose}>
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={addComment}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
