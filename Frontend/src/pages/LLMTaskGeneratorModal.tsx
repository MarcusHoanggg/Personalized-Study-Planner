import { useState } from "react";
import axios from 'axios';
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import type { Task } from "../types";

interface LLMTaskGeneratorModalProps {
    onClose: () => void;
    onAddTask: (task: Task) => void;
}

interface SuggestedTask {
    taskId: number;
    taskName: string;
    taskDescription: string;
    taskDeadline: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: string;
}

export default function LLMTaskGeneratorModal({
                                                  onClose,
                                                  onAddTask,
                                              }: LLMTaskGeneratorModalProps) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedTasks, setGeneratedTasks] = useState<SuggestedTask[]>([]);

    // ───────────────────────────────────────────────
    // CALL BACKEND → GENERATE TASKS
    // ───────────────────────────────────────────────
    const generateTasks = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "/api/v1/suggestions/generate",
                {
                    prompt,
                    additionalContext: "",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setGeneratedTasks(res.data.data.suggestions);
            console.log(res.data.data.suggestions);
        } catch (err: any) {
            console.error("LLM error:", err.response?.data || err.message);
        }

        setLoading(false);
    };

    // ───────────────────────────────────────────────
    // ACCEPT TASK → BACKEND → ADD TO DASHBOARD
    // ───────────────────────────────────────────────
    const acceptTask = async (suggestionId: number) => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `/api/v1/suggestions/${suggestionId}/accept`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            // Remove from UI
            setGeneratedTasks(
                (prev) => prev.filter((t) => t.taskId !== suggestionId),
            );
        } catch (err: any) {
            console.error("Accept error:", err.response?.data || err.message);
        }
    };

    // ───────────────────────────────────────────────
    // REJECT TASK → BACKEND
    // ───────────────────────────────────────────────
    const rejectTask = async (suggestionId: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `/api/v1/suggestions/${suggestionId}/decline`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setGeneratedTasks((prev) =>
                prev.filter((t) => t.taskId !== suggestionId),
            );
        } catch (err) {
            console.error("Reject error:", err);
        }
    };

    // ───────────────────────────────────────────────
    // UI
    // ───────────────────────────────────────────────
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg rounded-3xl border border-purple-100 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
                    AI Task Generator
                </h2>

                <Input
                    placeholder="What do you want to learn?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mb-4"
                />

                <Button
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={generateTasks}
                >
                    {loading ? "Generating..." : "Generate Tasks"}
                </Button>

                {/* Generated Tasks */}
                {generatedTasks.length > 0 && (
                    <div className="mt-6 space-y-3 max-h-64 overflow-y-auto pr-2">
                        {generatedTasks.map((task) => (
                            <div
                                key={task.taskId} // ✅ Fixed
                                className="p-3 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700"
                            >
                                <p className="text-purple-700 dark:text-purple-300 font-medium">
                                    {task.taskName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {task.taskDescription}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Deadline: {task.taskDeadline}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Priority: {task.priority}
                                </p>

                                <div className="flex gap-2 mt-3">
                                    <Button
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                                        onClick={() => acceptTask(task.taskId)} // ✅ Fixed
                                    >
                                        Accept
                                    </Button>

                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                        onClick={() => rejectTask(task.taskId)} // ✅ Fixed
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    className="mt-6 w-full border border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={onClose}
                >
                    Close
                </Button>
            </Card>
        </div>
    );
}