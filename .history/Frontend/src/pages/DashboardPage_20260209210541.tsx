
// import { useEffect, useState } from "react";
// import { getTasks, createTask } from "../services/tasks";
// import PageHeader from "../ui/PageHeader";
// import StatsCard from "../ui/StatsCard";
// import Input from "../ui/Input";
// import Select from "../ui/Select";
// import Button from "../ui/Button";
// import EmptyState from "../ui/EmptyState";
// import type { Task } from "../types";
// import TaskCard from "../components/TaskCard";
// import NewTaskModal from "../components/NewTaskModal";

// export default function DashboardPage() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>("all");
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     getTasks().then((data) => setTasks(data));
//   }, []);

//   const stats = {
//     total: tasks.length,
//     todo: tasks.filter((t) => t.status === "todo").length,
//     inProgress: tasks.filter((t) => t.status === "in_progress").length,
//     completed: tasks.filter((t) => t.status === "completed").length,
//   };

//   const filtered = tasks.filter((t) => {
//     const matchesStatus = statusFilter === "all" || t.status === statusFilter;
//     const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   const handleCreateTask = async (task: Task) => {
//     const newTask = await createTask(task);
//     setTasks((prev) => [...prev, newTask]);
//   };

//   return (
//     <div className="animate-pageFade">
//       <PageHeader title="Dashboard" subtitle="Overview of your study tasks">
//         <Button onClick={() => setShowModal(true)}>+ New Task</Button>
//       </PageHeader>

//       {showModal && (
//         <NewTaskModal
//           onClose={() => setShowModal(false)}
//           onCreate={handleCreateTask}
//         />
//       )}

//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <StatsCard label="Total Tasks" value={stats.total} />
//         <StatsCard label="To Do" value={stats.todo} />
//         <StatsCard label="In Progress" value={stats.inProgress} />
//         <StatsCard label="Completed" value={stats.completed} />
//       </div>

//       <div className="flex items-center gap-4 mb-6">
//         <Input
//           placeholder="Search tasks..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <Select
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(e.target.value as "all" | Task["status"])
//           }
//         >
//           <option value="all">All Status</option>
//           <option value="todo">To Do</option>
//           <option value="in_progress">In Progress</option>
//           <option value="completed">Completed</option>
//         </Select>

//         <Select>
//           <option>Created Date</option>
//           <option>Deadline</option>
//           <option>Priority</option>
//         </Select>
//       </div>

//       {filtered.length === 0 ? (
//         <EmptyState message="No tasks yet. Create your first task to get started!" />
//       ) : (
//         <div className="space-y-3">
//   {filtered
//     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//     .map((t) => (
//       <TaskCard
//         key={t.id}
//         task={t}
//         onUpdate={(updated) =>
//           setTasks((prev) =>
//             prev.map((task) => (task.id === updated.id ? updated : task))
//           )
//         }
//         onDelete={(id) =>
//           setTasks((prev) => prev.filter((task) => task.id !== id))
//         }
//       />
//     ))}
// </div>

//       )}
//     </div>
//   );
// }

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

type StatusFilter = "all" | TaskStatus;
type SortBy = "created" | "deadline" | "priority";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created");
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // save to localStorage
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
    sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sortBy === "deadline") {
    sorted.sort(
      (a, b) =>
        new Date(a.deadline ?? 0).getTime() -
        new Date(b.deadline ?? 0).getTime()
    );
  } else if (sortBy === "priority") {
    const order: Record<NonNullable<Task["priority"]>, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    sorted.sort(
      (a, b) =>
        (order[b.priority ?? "medium"] ?? 2) -
        (order[a.priority ?? "medium"] ?? 2)
    );
  }

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

  return (
    <div className="animate-pageFade">
      <PageHeader title="Dashboard" subtitle="Overview of your study tasks">
        <Button onClick={() => setShowNewModal(true)}>+ New Task</Button>
      </PageHeader>

      {showNewModal && (
        <NewTaskModal
          onClose={() => setShowNewModal(false)}
          onCreate={handleCreateTask}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete task?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-7 mb-6">
        <StatsCard label="Total Tasks" value={stats.total} />
        <StatsCard label="To Do" value={stats.todo} />
        <StatsCard label="In Progress" value={stats.inProgress} />
        <StatsCard label="Completed" value={stats.completed} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as StatusFilter)
          }
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
        >
          <option value="created">Created Date</option>
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </Select>
      </div>

      {sorted.length === 0 ? (
        <EmptyState message="No tasks yet. Create your first task to get started!" />
      ) : (
        <div className="space-y-3 relative overflow-visible">
          {sorted.map((t) => (
            <div
              key={t.id}
              className="transition-transform duration-200 hover:scale-[1.01]"
            >
              <TaskCard
                task={t}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onEdit={(task) => setEditingTask(task)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
