// export function LogsModal({ task, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         <h3 className="font-semibold mb-4">Movement Logs</h3>

//         <div className="space-y-2 max-h-64 overflow-auto text-sm">
//           {(task.updates || []).map((u, i) => (
//             <div key={i} className="border p-2 rounded">
//               <div>
//                 <b>{u.from}</b> → <b>{u.to}</b>
//               </div>
//               <div className="text-xs text-gray-500">
//                 {new Date(u.date).toLocaleString()}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end mt-4">
//           <button className="px-4 py-2 border rounded" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { X, ArrowRight, History, Clock } from "lucide-react";

export function LogsModal({ task, onClose }) {
  // Sort updates by date (newest first)
  const updates = [...(task.updates || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History className="text-blue-600" size={20} />
            <div>
                <h3 className="font-bold text-gray-800">Task History</h3>
                <p className="text-xs text-gray-500 max-w-[250px] truncate">
                   {task.drive_link || "Untitled Task"}
                </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
          {updates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
              <Clock size={40} className="mb-2 opacity-20" />
              <p>No movement history yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
               {updates.map((u, i) => (
                <div key={i} className="flex gap-3 relative">
                  {/* Timeline Line */}
                  {i !== updates.length - 1 && (
                    <div className="absolute left-[19px] top-8 bottom-[-16px] w-[2px] bg-gray-100"></div>
                  )}

                  {/* Icon Container */}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                     <ArrowRight size={16} className="text-blue-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                        {u.from}
                      </span>
                      <ArrowRight size={12} className="text-gray-400" />
                      <span className="font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase text-xs tracking-wider">
                        {u.to}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
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
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button 
            className="px-5 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}