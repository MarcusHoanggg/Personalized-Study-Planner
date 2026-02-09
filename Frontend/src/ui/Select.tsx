import { SelectHTMLAttributes } from "react";

export default function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
      {...props}
    />
  );
}
