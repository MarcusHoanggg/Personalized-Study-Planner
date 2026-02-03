import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-border rounded-lg shadow p-6 ${className}`}
    >
      {children}
    </div>
  );
}
