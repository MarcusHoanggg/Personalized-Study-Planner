import { useState } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import type { Task } from "../types";
interface LLMTaskGeneratorModalProps {
    onClose: () => void;
    onAddTask: (task: Task) => void;
}


export default function LLMTaskGeneratorModal({
  onClose,
  onAddTask
}: LLMTaskGeneratorModalProps){
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
    const id = crypto.randomUUID();
    const handleAction = (title: string, status: Task["status"]) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            status,
            priority: "medium",
            createdAt: new Date().toISOString(),
            deadline: status === "todo" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined, // default deadline 1 week from now for new tasks
        };

        onAddTask(newTask);

        // remove from generated list
        setGeneratedTasks((prev) => prev.filter((t) => t !== title));
    };

    const generateTasks = async () => {
        setLoading(true);

        // TEMPORARY FRONTEND MOCK — backend will replace this
        setTimeout(() => {
            setGeneratedTasks([
                "Set up Spring Boot project",
                "Create REST controller",
                "Configure application.properties",
                "Add service layer",
                "Add repository layer",
                "Connect to database",
                "Implement CRUD operations",
                "Test endpoints",
                "Deploy application"
            ]);
            setLoading(false);
        }, 1200);
    };

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
                        {generatedTasks.map((task, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700"
                            >
                                <p className="text-purple-700 dark:text-purple-300 font-medium">
                                    {task}
                                </p>

                                <div className="flex gap-2 mt-2">
                                    <Button
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                                        onClick={() => handleAction(task, "todo")}
                                    >
                                        Accept
                                    </Button>

                                    <Button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                                        onClick={() => handleAction(task, "in_progress")}
                                    >
                                        Pending
                                    </Button>

                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                        onClick={() =>
                                            setGeneratedTasks((prev) => prev.filter((t) => t !== task))
                                        }
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
