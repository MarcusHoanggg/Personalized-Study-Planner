import { useEffect, useState } from "react";
import PageHeader from "../ui/PageHeader";
import StatsCard from "../ui/StatsCard";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import type { Task, TaskStatus } from "../types";
import TaskCard from "../components/TaskCard";
import NewTaskModal from "../components/NewTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ShareTaskModal from "../components/ShareTaskModal";
import LLMTaskGeneratorModal from "./LLMTaskGeneratorModal";

type StatusFilter = "all" | TaskStatus;
type SortBy = "created" | "deadline" | "priority";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created");

  const [showNewModal, setShowNewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showLLMModal, setShowLLMModal] = useState(false);

  

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleCreateTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTask = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    setTasks((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

  const handleShareTasks = async (
    selectedTaskIds: string[],
    recipientEmail: string
  ) => {
    // TODO: Replace with actual API call to your backend
    console.log(
      `Sharing tasks ${selectedTaskIds.join(", ")} to ${recipientEmail}`
    );
    // Remove the alert() line below:
    // alert(`Tasks shared with ${recipientEmail}`);
  };

  // Load tasks
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const filtered = tasks.filter((t) => {
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  let sorted = [...filtered];

  if (sortBy === "created") {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === "deadline") {
    sorted.sort(
      (a, b) =>
        new Date(a.deadline ?? 0).getTime() -
        new Date(b.deadline ?? 0).getTime()
    );
  } else if (sortBy === "priority") {
    const order = { high: 3, medium: 2, low: 1 };
    sorted.sort(
      (a, b) =>
        (order[b.priority ?? "medium"] ?? 2) -
        (order[a.priority ?? "medium"] ?? 2)
    );
  }

  return (
    <div className="animate-pageFade space-y-8">

      {/* HEADER */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your study tasks"
      >
        <div className="flex items-center gap-3">
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white shadow-md"
          onClick={() => setShowShareModal(true)}
        >
          Share Tasks
        </Button>

        <button
          onClick={() => setShowLLMModal(true)}
          className="
    fixed bottom-6 right-6 z-40
    bg-purple-500 hover:bg-purple-600
    text-white text-2xl
    w-14 h-14 rounded-full
    shadow-lg flex items-center justify-center
    dark:bg-purple-600 dark:hover:bg-purple-700
  "
        >
          🤖
        </button>

        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white shadow-md"
          onClick={() => setShowNewModal(true)}
        >
          + New Task
        </Button>
        </div>
      </PageHeader>

      {/* NEW TASK MODAL */}
      {showNewModal && (
        <NewTaskModal
          onClose={() => setShowNewModal(false)}
          onCreate={handleCreateTask}
        />
      )}

      {/* SHARE TASKS MODAL */}
      {showShareModal && (
        <ShareTaskModal
          tasks={tasks}
          onClose={() => setShowShareModal(false)}
          onShare={handleShareTasks}
        />
      )}

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}

      {
    showLLMModal && (
      <LLMTaskGeneratorModal onClose={() => setShowLLMModal(false)}
       onAddTask={handleCreateTask} />
    )
  }

      {/* DELETE CONFIRMATION */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              Delete task?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-100"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard label="Total Tasks" value={stats.total} color="purple" />
        <StatsCard label="To Do" value={stats.todo} color="blue" />
        <StatsCard label="In Progress" value={stats.inProgress} color="yellow" />
        <StatsCard label="Completed" value={stats.completed} color="green" />
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border-purple-200 focus:border-purple-400"
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="bg-white border-purple-200 focus:border-purple-400"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="bg-white border-purple-200 focus:border-purple-400"
        >
          <option value="created">Created Date</option>
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </Select>
      </div>

      {/* TASK LIST */}
      {sorted.length === 0 ? (
        <EmptyState message="No tasks yet. Create your first task to get started!" />
      ) : (
        <div className="space-y-4 relative overflow-visible">
          {sorted.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onEdit={(task) => setEditingTask(task)}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
            />
          ))}
        </div>
      )}
    </div>
  );
}