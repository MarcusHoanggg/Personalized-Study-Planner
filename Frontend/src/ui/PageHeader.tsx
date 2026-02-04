import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2>{title}</h2>
        {subtitle && (
          <p className="text-gray-600 dark:text-slate-300">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
