export function LogsModal({ task, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="font-semibold mb-4">Movement Logs</h3>

        <div className="space-y-2 max-h-64 overflow-auto text-sm">
          {(task.updates || []).map((u, i) => (
            <div key={i} className="border p-2 rounded">
              <div>
                <b>{u.from}</b> → <b>{u.to}</b>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(u.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 border rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
