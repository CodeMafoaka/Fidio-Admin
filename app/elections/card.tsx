"use client";

import {
  Calendar,
  Users,
  Vote,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { Election } from "@/types";
import { StatusBadge, Button } from "@/components/ui";
import { formatDate, cn } from "@/lib/utils";

interface ElectionCardProps {
  election: Election;
  onActivate: (id: string) => void;
  onComplete: (id: string) => void;
  onToggleVotes: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function ElectionCard({
  election,
  onActivate,
  onComplete,
  onToggleVotes,
  onDelete,
  onView,
  onEdit,
}: ElectionCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-slate-400 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden group">
      <div
        className={cn(
          "h-0.5 w-full",
          election.status === "active"
            ? "bg-emerald-400"
            : election.status === "draft"
            ? "bg-amber-400"
            : "bg-slate-500"
        )}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <StatusBadge status={election.status} type="election" />
              {election.status === "active" && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold",
                    election.votesOpen
                      ? "bg-emerald-200 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      election.votesOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    )}
                  />
                  {election.votesOpen ? "Votes ouverts" : "Votes fermés"}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1">
              {election.title}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{election.description}</p>
          </div>

          {/* Icon actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onView?.(election.id)}
              aria-label="Voir les détails"
              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit?.(election.id)}
              aria-label="Modifier"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(election.id)}
              aria-label="Supprimer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {formatDate(election.startDate)} → {formatDate(election.endDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 shrink-0" />
            {election.candidates} candidat{election.candidates !== 1 ? "s" : ""}
          </span>
          {(election.totalVotes ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <Vote className="w-3.5 h-3.5 shrink-0" />
              {election.totalVotes} vote{(election.totalVotes ?? 0) !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onView?.(election.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Détails
            <ChevronRight className="w-3 h-3" />
          </button>

          {election.status === "draft" && (
            <Button
              size="sm"
              onClick={() => onActivate(election.id)}
              icon={<CheckCircle className="w-3.5 h-3.5" />}
            >
              Activer
            </Button>
          )}

          {election.status === "active" && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onComplete(election.id)}
                icon={<Clock className="w-3.5 h-3.5" />}
              >
                Terminer
              </Button>
              <Button
                size="sm"
                variant={election.votesOpen ? "danger" : "primary"}
                onClick={() => onToggleVotes(election.id)}
                icon={election.votesOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              >
                {election.votesOpen ? "Fermer votes" : "Ouvrir votes"}
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}