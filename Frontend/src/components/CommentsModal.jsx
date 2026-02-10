import { useState, useEffect, useRef } from "react";
import { X, Send, User, Shield, Users } from "lucide-react";
import { addTaskComment } from "../services/projectService";

export function CommentsModal({ task, projectId, onClose, onSaved }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

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

    const res = await addTaskComment(token, projectId, taskOwnerId, payload);
    
    if (res.success) {
      setText("");
      onSaved(); 
      onClose();
    } else {
      console.error("Failed to add comment", res.message);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col h-[600px]">
        
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800">Task Comments</h3>
            <p className="text-xs text-gray-500 truncate max-w-[250px]">
              Task: {task.drive_link || "Untitled Task"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref={scrollRef}>
          {allComments.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
              <p>No comments yet.</p>
              <p>Start the conversation!</p>
            </div>
          )}

          {allComments.map((c, i) => (
            <div key={i} className={`flex flex-col ${c.role === 'assignee' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 border shadow-sm ${c.color} relative`}
              >
                {/* Header inside bubble */}
                <div className="flex items-center gap-2 mb-1">
                    {c.role === 'creator' && <Shield size={12} className="text-blue-600"/>}
                    {c.role === 'assignee' && <User size={12} className="text-green-600"/>}
                    {c.role === 'team' && <Users size={12} className="text-gray-600"/>}
                    
                    <span className="text-xs font-bold text-gray-700">
                        {c.name || "Unknown"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                        {new Date(c.last_edited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {c.text}
                </p>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 px-2">
                 {new Date(c.last_edited).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex gap-2 items-end">
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm custom-scrollbar"
              placeholder="Type your comment..."
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                }
              }}
            />
            <button 
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Press Enter to send
          </p>
        </div>

      </div>
    </div>
  );
}
