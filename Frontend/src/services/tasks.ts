// src/services/tasks.ts
import type { Task, TaskStatus } from '../types';

let tasks: Task[] = [];

export function getTasks(): Promise<Task[]> {
  return Promise.resolve(tasks);
}

export function createTask(partial: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const task: Task = {
    ...partial,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  tasks = [...tasks, task];
  return Promise.resolve(task);
}

export function updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
  tasks = tasks.map(t => (t.id === id ? { ...t, status } : t));
  return Promise.resolve(tasks.find(t => t.id === id) ?? null);
}
