interface StatsCardProps {
  label: string;
  value: number | string;
}

export default function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-border rounded-lg shadow p-4">
      <p className="text-gray-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
