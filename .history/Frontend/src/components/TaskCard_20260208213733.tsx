
// import { useState } from "react";
// import type { Task } from "../types";

// export default function TaskCard({ task, onUpdate, onDelete }: {
//   task: Task;
//   onUpdate: (updated: Task) => void;
//   onDelete: (id: string) => void;
// }) {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const priority = task.priority ?? "medium";
//   const description = task.description ?? "";

//   const priorityColors = {
//     high: "border-purple-500 bg-purple-50 text-purple-700",
//     medium: "border-green-500 bg-green-50 text-green-700",
//     low: "border-yellow-500 bg-yellow-50 text-yellow-700",
//   };

//   const borderColor = {
//     high: "border-l-4 border-purple-500",
//     medium: "border-l-4 border-green-500",
//     low: "border-l-4 border-yellow-500",
//   };

//   const toggleComplete = () => {
//     onUpdate({
//       ...task,
//       status: task.status === "completed" ? "todo" : "completed",
//     });
//   };

//   return (
//     <div
//       className={`relative bg-white shadow-md rounded-lg p-4 mb-4 transition-shadow hover:shadow-lg ${borderColor[priority]}`}
//     >
//       {/* Three dots menu */}
//       <button
//         className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         ⋮
//       </button>

//       {menuOpen && (
//         <div className="absolute right-3 top-10 bg-white shadow-lg rounded-md w-32 z-20">
//           <button className="block w-full text-left px-3 py-2 hover:bg-gray-100"
//             onClick={() => alert("Edit coming soon")}
//           >
//             Edit
//           </button>
//           <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
//             Set Reminder
//           </button>
//           <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
//             Share
//           </button>
//           <button
//             className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
//             onClick={() => onDelete(task.id)}
//           >
//             Delete
//           </button>
//         </div>
//       )}

//       <div className="flex items-start gap-3">
//         {/* Circle checkbox */}
//         <button
//           onClick={toggleComplete}
//           className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//             task.status === "completed"
//               ? "bg-green-500 border-green-500"
//               : "border-gray-400"
//           }`}
//         >
//           {task.status === "completed" && <span className="text-white text-sm">✓</span>}
//         </button>

//         <div className="flex-1">
//           <h3
//             className={`text-lg font-semibold ${
//               task.status === "completed" ? "line-through text-gray-400" : ""
//             }`}
//           >
//             {task.title}
//           </h3>

//           <p className="text-sm text-gray-600">{description}</p>

//           {/* Created date */}
//           <p className="text-xs text-gray-400 mt-1">
//             Created on: {new Date(task.createdAt).toLocaleDateString()}
//           </p>

//           <div className="flex items-center gap-2 mt-2">
//             <span
//               className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[priority]}`}
//             >
//               {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
//             </span>

//             <span className="text-xs text-gray-500">
//               {task.status === "completed" ? "Completed" : task.status}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import type { Task } from "../types";

interface TaskCardProps {
    task: Task;
    onUpdate: (updated: Task) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const priority = task.priority ?? "medium";
    const description = task.description ?? "";

    const priorityColors: Record<NonNullable<Task["priority"]>, string> = {
        high: "border-purple-500 bg-purple-50 text-purple-700",
        medium: "border-green-500 bg-green-50 text-green-700",
        low: "border-yellow-500 bg-yellow-50 text-yellow-700",
    };

    const borderColor: Record<NonNullable<Task["priority"]>, string> = {
        high: "border-l-4 border-purple-500",
        medium: "border-l-4 border-green-500",
        low: "border-l-4 border-yellow-500",
    };

    const toggleComplete = () => {
        onUpdate({
            ...task,
            status: task.status === "completed" ? "todo" : "completed",
        });
    };

    const createdLabel = new Date(task.createdAt).toLocaleDateString();
    const deadlineLabel = task.deadline ? new Date(task.deadline).toLocaleDateString() : null;

    return (
        <div
            className={`relative bg-white dark:bg-slate-800 shadow-md rounded-lg p-4 mb-3 transition-all hover:shadow-lg ${borderColor[priority]}`}
        >
            {/* three dots */}
            <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setMenuOpen((v) => !v)}
            >
                ⋮
            </button>

            {menuOpen && (
                <div className="absolute right-2 top-8 bg-white dark:bg-slate-800 
shadow-xl rounded-md w-40 z-[999] border border-gray-200 dark:border-slate-700">
                    <button
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                        onClick={() => {
                            setMenuOpen(false);
                            onEdit(task);
                        }}
                    >
                        Edit
                    </button>
                    <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                        Set Reminder
                    </button>
                    <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700">
                        Share
                    </button>
                    <button
                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </button>
                </div>
            )}

            <div className="flex items-start gap-3">
                {/* circle checkbox */}
                <button
                    onClick={toggleComplete}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.status === "completed"
                            ? "bg-green-500 border-green-500"
                            : "border-gray-400"
                        }`}
                >
                    {task.status === "completed" && (
                        <span className="text-white text-xs">✓</span>
                    )}
                </button>

                <div className="flex-1">
                    <h3
                        className={`text-lg font-semibold ${task.status === "completed" ? "line-through text-gray-400" : ""
                            }`}
                    >
                        {task.title}
                    </h3>

                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {description}
                        </p>
                    )}

                    <div className="mt-1 text-xs text-gray-400 flex gap-3">
                        <span>Created on: {createdLabel}</span>
                        {deadlineLabel && <span>Due: {deadlineLabel}</span>}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[priority]}`}
                        >
                            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                        </span>

                        <span className="text-xs text-gray-500">
                            {task.status === "completed"
                                ? "Completed"
                                : task.status === "in_progress"
                                    ? "In Progress"
                                    : "To Do"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
