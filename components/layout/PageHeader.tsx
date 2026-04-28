import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  stats?: { label: string; value: number }[];
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, stats, actions }: PageHeaderProps) {
  return (
    <div className="px-8 py-6 bg-white border-b border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-sm text-slate-600">{description}</p>
          {stats && stats.length > 0 && (
            <div className="flex items-center gap-6 mt-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                  <span className="text-sm text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
