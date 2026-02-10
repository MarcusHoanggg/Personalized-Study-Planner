// import { useState } from "react";
// import type { Task } from "../types";
// import Button from "../ui/Button";
// import Input from "../ui/Input";
// import Select from "../ui/Select";

// export default function NewTaskModal({ onClose, onCreate }: {
//   onClose: () => void;
//   onCreate: (task: Task) => void;
// }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
//   const [status, setStatus] = useState<"todo" | "in_progress" | "completed">("todo");
//   const [deadline, setDeadline] = useState("");

//   const handleSubmit = () => {
//     if (!title.trim()) return;

//     const newTask: Task = {
//       id: crypto.randomUUID(),
//       title,
//       description,
//       priority,
//       status,
//       deadline,
//       createdAt: new Date().toISOString(),

//     };

//     onCreate(newTask);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
//         <h2 className="text-xl font-bold mb-4">Create New Task</h2>

//         <label className="text-sm font-medium">Title *</label>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" />

//         <label className="text-sm font-medium">Description</label>
//         <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mb-3" />

//         <div className="grid grid-cols-2 gap-4 mb-3">
//           <div>
//             <label className="text-sm font-medium">Priority</label>
//             <Select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </Select>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Status</label>
//             <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
//               <option value="todo">To Do</option>
//               <option value="in_progress">In Progress</option>
//               <option value="completed">Completed</option>
//             </Select>
//           </div>
//         </div>

//         <label className="text-sm font-medium">Deadline</label>
//         <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mb-4" />

//         <div className="flex justify-end gap-3">
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button onClick={handleSubmit}>Create Task</Button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import type { Task, TaskStatus } from "../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface NewTaskModalProps {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

export default function NewTaskModal({ onClose, onCreate }: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      status,
      deadline: deadline || undefined,
      createdAt: new Date().toISOString(),
    };

    onCreate(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>

        <label className="text-sm font-medium">Title *</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3"
          placeholder="Complete Math Assignment"
        />

        <label className="text-sm font-medium">Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-3"
          placeholder="Add details about your task…"
        />

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
        </div>

        <label className="text-sm font-medium">Deadline</label>
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Task</Button>
        </div>
      </div>
    </div>
  );
}

