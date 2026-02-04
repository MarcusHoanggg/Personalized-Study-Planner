interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center text-gray-500 dark:text-slate-400 py-20 bg-white dark:bg-slate-800 rounded-lg border border-border shadow">
      {message}
    </div>
  );
}
