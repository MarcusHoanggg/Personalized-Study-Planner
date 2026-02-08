import { useEffect, useState } from "react";
import { getTasks, createTask } from "../services/tasks";
import PageHeader from "../ui/PageHeader";
import StatsCard from "../ui/StatsCard";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import type { Task } from "../types";
import TaskCard from "../components/TaskCard";
import NewTaskModal from "../components/NewTaskModal";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getTasks().then((data) => setTasks(data));
  }, []);

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

  const handleCreateTask = async (task: Task) => {
    const newTask = await createTask(task);
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="animate-pageFade">
      <PageHeader title="Dashboard" subtitle="Overview of your study tasks">
        <Button onClick={() => setShowModal(true)}>+ New Task</Button>
      </PageHeader>

      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateTask}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <section className="lg:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatsCard label="Total Tasks" value={stats.total} />
            <StatsCard label="To Do" value={stats.todo} />
            <StatsCard label="In Progress" value={stats.inProgress} />
            <StatsCard label="Completed" value={stats.completed} />
          </div>
        </section>

        <section className="lg:col-span-8 space-y-6 h-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6">
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | Task["status"])
                }
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Select>
                <option>Created Date</option>
                <option>Deadline</option>
                <option>Priority</option>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="min-h-[400px] border rounded-xl bg-white flex items-center justify-center p-6">
              <div className="text-center text-gray-500">No tasks yet. Create your first task to get started!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onUpdate={(updated) =>
                      setTasks((prev) =>
                        prev.map((task) =>
                          task.id === updated.id ? updated : task
                        )
                      )
                    }
                    onDelete={(id) =>
                      setTasks((prev) => prev.filter((task) => task.id !== id))
                    }
                  />
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
