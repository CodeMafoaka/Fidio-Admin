import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "election" | "candidate" | "default";
}

const statusConfig = {
  election: {
    draft: { bg: "bg-amber-100", text: "text-amber-700", label: "Brouillon" },
    active: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Active" },
    completed: { bg: "bg-slate-100", text: "text-slate-600", label: "Terminée" },
  },
  candidate: {
    pending: { bg: "bg-blue-100", text: "text-blue-700", label: "En attente" },
    approved: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approuvé" },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejeté" },
  },
  default: {
    draft: { bg: "bg-slate-100", text: "text-slate-600", label: "Brouillon" },
    active: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Actif" },
    completed: { bg: "bg-slate-100", text: "text-slate-600", label: "Terminé" },
  },
} as const;

export default function StatusBadge({ status, type = "default" }: StatusBadgeProps) {
  const config = type === "election" && status in statusConfig.election
    ? statusConfig.election[status as keyof typeof statusConfig.election]
    : type === "candidate" && status in statusConfig.candidate
    ? statusConfig.candidate[status as keyof typeof statusConfig.candidate]
    : status in statusConfig.default
    ? statusConfig.default[status as keyof typeof statusConfig.default]
    : null;

  if (!config) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
        {status}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", config.bg, config.text)}>
      {config.label}
    </span>
  );
}
