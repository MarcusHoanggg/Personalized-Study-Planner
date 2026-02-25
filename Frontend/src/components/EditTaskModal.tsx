
import { useState } from "react";
import type { Task, TaskStatus } from "../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updated: Task) => void;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task.priority ?? "medium"
  );
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [deadline, setDeadline] = useState(task.deadline ?? "");

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      ...task,
      title,
      description,
      priority,
      status,
      deadline: deadline || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md shadow-xl border border-purple-100 animate-fadeIn">

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-purple-700">
          Edit Task
        </h2>

        <div className="space-y-5">

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-600">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-600">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Priority</label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-sm font-medium text-gray-600">Deadline</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-purple-300 text-purple-600 hover:bg-purple-100"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="bg-purple-500 hover:bg-purple-600 text-white shadow-md"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
