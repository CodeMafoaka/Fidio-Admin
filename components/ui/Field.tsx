import React from "react";

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function fieldInputClass() {
  return "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
}

export default function Field({ label, error, hint, icon, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
