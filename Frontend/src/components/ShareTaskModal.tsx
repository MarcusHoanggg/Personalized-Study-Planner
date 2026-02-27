import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { Task } from "../types";

interface ShareTaskModalProps {
  tasks: Task[];
  onClose: () => void;
  onShare: (selectedTaskIds: string[], recipientEmail: string) => Promise<void>;
}

export default function ShareTaskModal({
  tasks,
  onClose,
  onShare,
}: ShareTaskModalProps) {
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleTask = (taskId: string) => {
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedTaskIds.size === tasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(tasks.map((t) => t.id)));
    }
  };

  const handleShare = async () => {
    if (selectedTaskIds.size === 0) {
      setError("Please select at least one task");
      return;
    }

    if (!recipientEmail.trim()) {
      setError("Please enter a recipient email");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await onShare(Array.from(selectedTaskIds), recipientEmail);
      setSuccess("Tasks sent successfully.");
      setSelectedTaskIds(new Set());
      setRecipientEmail("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl border border-purple-100 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Share Tasks</h2>

        {/* Recipient Email Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Email
          </label>
          <Input
            type="email"
            placeholder="Enter recipient email..."
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="bg-white border-purple-200 focus:border-purple-400"
            disabled={loading}
          />
        </div>

        {/* Select All */}
        <div className="mb-4 pb-4 border-b border-purple-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTaskIds.size === tasks.length && tasks.length > 0}
              onChange={toggleAll}
              disabled={tasks.length === 0 || loading}
              className="w-4 h-4 rounded cursor-pointer accent-purple-500"
            />
            <span className="font-medium text-gray-700">
              Select All ({selectedTaskIds.size}/{tasks.length})
            </span>
          </label>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tasks available</p>
        ) : (
          <div className="space-y-3 mb-6">
            {tasks.map((task) => (
              <label
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selectedTaskIds.has(task.id)}
                  onChange={() => toggleTask(task.id)}
                  disabled={loading}
                  className="w-4 h-4 rounded mt-1 cursor-pointer accent-purple-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.deadline && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-100"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            onClick={handleShare}
            disabled={loading || selectedTaskIds.size === 0}
          >
            {loading ? "Sharing..." : "Share Tasks"}
          </Button>
        </div>
      </div>
    </div>
  );
}