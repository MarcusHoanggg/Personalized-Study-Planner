import { useState } from "react";
import type { Task, TaskStatus } from "../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { createTask } from "../services/tasks";
import { useTranslation } from "react-i18next";

interface NewTaskModalProps {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

export default function NewTaskModal({ onClose, onCreate }: NewTaskModalProps) {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      const newTask = await createTask({
        title,
        description,
        priority,
        status,
        deadline: deadline || undefined,
      });

      onCreate(newTask);
      onClose();
    } catch (err) {
      console.error("Failed to create task:", err);
      setError(err instanceof Error ? err.message : t("newtask.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md shadow-xl border border-purple-100 animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6 text-purple-700">
          {t("newtask.title")}
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("newtask.labelTitle")}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("newtask.placeholderTitle")}
              className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("newtask.labelDescription")}
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("newtask.placeholderDescription")}
              className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                {t("newtask.priority")}
              </label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
              >
                <option value="low">{t("priority.low")}</option>
                <option value="medium">{t("priority.medium")}</option>
                <option value="high">{t("priority.high")}</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                {t("newtask.status")}
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
              >
                <option value="todo">{t("task.status.todo")}</option>
                <option value="in_progress">{t("task.status.in_progress")}</option>
                <option value="completed">{t("task.status.completed")}</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("newtask.deadline")}
            </label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-purple-300 text-purple-600 hover:bg-purple-100"
          >
            {t("newtask.cancel")}
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white shadow-md"
          >
            {loading ? t("newtask.creating") : t("newtask.create")}
          </Button>
        </div>
      </div>
    </div>
  );
}