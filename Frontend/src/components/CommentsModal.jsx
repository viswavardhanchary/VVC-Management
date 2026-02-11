import { useState, useEffect, useRef } from "react";
import { X, Send, User, Shield, Users } from "lucide-react";
import { addTaskComment } from "../services/projectService";
import {Toast} from './Toast';

export function CommentsModal({ task, projectId, onClose, onSaved }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const taskOwnerId = task.userId;

  const allComments = [
    ...(task.comments?.by_creator || []).map(c => ({ ...c, role: "creator", color: "bg-blue-100 border-blue-200" })),
    ...(task.comments?.by_user || []).map(c => ({ ...c, role: "assignee", color: "bg-green-100 border-green-200" })),
    ...(task.comments?.by_others || []).map(c => ({ ...c, role: "team", color: "bg-gray-100 border-gray-200" }))
  ].sort((a, b) => new Date(a.last_edited) - new Date(b.last_edited));

  // Scroll to bottom on load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allComments.length]);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);


    let type = "by_others";
    if (String(currentUserId) === String(taskOwnerId)) {
      type = "by_user";
    } else {
      type = "by_creator";
    }

    const payload = {
      taskId: task._id,
      text: text,
      type: type,
      name: localStorage.getItem('userName')
    };

    if (!taskOwnerId) {
      setToast({ message: "User has not joined yet. Cannot Add Comments.", type: "error" });
    } else {
      const res = await addTaskComment(token, projectId, taskOwnerId, payload);

      if (res.success) {
        setText("");
        onSaved();
        onClose();
      } else {
        console.error("Failed to add comment", res.message);
      }
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 backdrop-blur-sm animate-fadeIn">
      <div className="fixed top-4 right-4 z-9999">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "info" })}
        />
      </div>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col h-150 animate-slideUp border border-cyan-200" style={{
        boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.1), 0 4px 6px -2px rgba(6, 182, 212, 0.05)'
      }}>

        {/* Header */}
        <div className="p-4 border-b bg-white border-cyan-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-teal-900">Task Comments</h3>
            <p className="text-xs text-teal-600 truncate max-w-62.5">
              Task: {task.drive_link || "Untitled Task"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-red-50 transition-all duration-200 hover:scale-110 text-cyan-600 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref={scrollRef}>
          {allComments.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-teal-400 text-sm">
              <p className="font-medium">No comments yet.</p>
              <p className="text-teal-500">Start the conversation!</p>
            </div>
          )}

          {allComments.map((c, i) => (
            <div key={i} className={`flex flex-col ${c.role === 'assignee' ? 'items-end' : 'items-start'} animate-slideInUp`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 border shadow-md ${c.color} relative backdrop-blur-sm hover:shadow-lg transition-all duration-200`}
              >
                {/* Header inside bubble */}
                <div className="flex items-center gap-2 mb-1">
                  {c.role === 'creator' && <Shield size={12} className="text-cyan-600" />}
                  {c.role === 'assignee' && <User size={12} className="text-emerald-600" />}
                  {c.role === 'team' && <Users size={12} className="text-cyan-600" />}

                  <span className="text-xs font-bold text-black">
                    {c.name || "Unknown"}
                  </span>
                  <span className="text-[10px] text-teal-600">
                    {new Date(c.last_edited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-sm text-black whitespace-pre-wrap leading-relaxed">
                  {c.text}
                </p>
              </div>
              <div className="text-[10px] text-teal-600 mt-1 px-2">
                {new Date(c.last_edited).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-cyan-200">
          <div className="flex gap-2 items-end">
            <textarea
              className="w-full border-2 border-cyan-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none text-sm custom-scrollbar text-black placeholder-cyan-400 transition-all duration-200"
              placeholder="Type your comment..."
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-3 rounded-xl hover:from-cyan-600 hover:to-cyan-700 disabled:from-cyan-300 disabled:to-cyan-400 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed font-medium"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-teal-600 mt-2 text-center font-medium">
            Press Enter to send
          </p>
        </div>

      </div>
    </div>
  );
}
