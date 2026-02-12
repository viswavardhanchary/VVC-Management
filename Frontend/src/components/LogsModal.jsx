import { X, ArrowRight, History, Clock } from "lucide-react";

export function LogsModal({ task, onClose }) {
  // Sort updates by date (newest first)
  const updates = [...(task.updates || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-slideUp border border-cyan-200" style={{
        boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.1), 0 4px 6px -2px rgba(6, 182, 212, 0.05)'
      }}>
        
        {/* Header */}
        <div className="p-4 border-b bg-white border-cyan-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History className="text-cyan-600" size={20} />
            <div>
                <h3 className="font-bold text-teal-900">Task History</h3>
                <p className="text-xs text-teal-600 max-w-62.5 truncate">
                   {task.drive_link || "Untitled Task"}
                </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-red-50 transition-all duration-200 hover:scale-110 text-cyan-600 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
          {updates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-teal-400 text-sm">
              <Clock size={40} className="mb-2 opacity-30" />
              <p className="font-medium">No movement history yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
               {updates.map((u, i) => (
                <div key={i} className="flex gap-3 relative animate-slideInUp" style={{ animationDelay: `${i * 0.05}s` }}>
                  {/* Timeline Line */}
                  {i !== updates.length - 1 && (
                    <div className="absolute left-4.75 top-8 -bottom-4 w-0.5 bg-linear-to-b from-cyan-400 to-cyan-200"></div>
                  )}

                  {/* Icon Container */}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-cyan-100 border-2 border-cyan-400 flex items-center justify-center shrink-0 shadow-md">
                     <ArrowRight size={16} className="text-cyan-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium px-3 py-1 rounded-lg bg-cyan-100 text-black uppercase text-xs tracking-wider border border-cyan-300">
                        {u.from}
                      </span>
                      <ArrowRight size={12} className="text-cyan-400" />
                      <span className="font-bold px-3 py-1 rounded-lg bg-linear-to-r from-cyan-400 to-cyan-500 text-white uppercase text-xs tracking-wider shadow-md">
                        {u.to}
                      </span>
                    </div>
                    <div className="text-xs text-teal-600 mt-2 flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {new Date(u.date).toLocaleString([], { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-cyan-50 border-cyan-200 flex justify-end">
          <button 
            className="px-5 py-2 border-2 border-cyan-400 rounded-lg bg-white hover:bg-cyan-50 text-sm font-bold transition-all duration-200 text-teal-700 hover:text-teal-900 hover:shadow-md hover:scale-105"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}