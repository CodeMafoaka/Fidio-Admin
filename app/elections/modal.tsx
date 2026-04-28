"use client";

import React, { useState } from "react";
import { X, Vote, Calendar, AlertTriangle } from "lucide-react";
import { Field, fieldInputClass, Button } from "@/components/ui";

interface ElectionFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface ElectionModalProps {
  onClose: () => void;
  onSubmit: (data: ElectionFormData) => Promise<void>;
}

function validate(data: ElectionFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.title.trim()) errors.title = "Le titre est requis";
  else if (data.title.trim().length < 3) errors.title = "Minimum 3 caractères";
  if (!data.description.trim()) errors.description = "La description est requise";
  else if (data.description.trim().length < 10) errors.description = "Minimum 10 caractères";
  if (!data.startDate) errors.startDate = "Date de début requise";
  if (!data.endDate) errors.endDate = "Date de fin requise";
  else if (data.startDate && new Date(data.endDate) < new Date(data.startDate))
    errors.endDate = "Doit être postérieure à la date de début";
  return errors;
}

const today = new Date().toISOString().split("T")[0];

export default function ElectionModal({ onClose, onSubmit }: ElectionModalProps) {
  const [data, setData] = useState<ElectionFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (field: keyof ElectionFormData, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setSubmitError("");
    try {
      await onSubmit(data);
    } catch {
      setSubmitError("Une erreur est survenue lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Accent */}
        <div className="h-1 bg-linear-to-r from-[#00843D] to-[#E8291E]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 id="modal-title" className="text-base font-bold text-slate-900">
              Nouvelle élection
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Configurez les paramètres de l`élection</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-4">
            {submitError && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {submitError}
              </div>
            )}

            <Field
              label="Titre"
              error={errors.title}
              icon={<Vote className="w-4 h-4" />}
              hint="Ex: Élection du Conseil Étudiant 2025"
            >
              <input
                type="text"
                value={data.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Nom de l'élection"
                className={fieldInputClass()}
                disabled={loading}
              />
            </Field>

            <Field
              label="Description"
              error={errors.description}
              icon={<Vote className="w-4 h-4" />}
            >
              <textarea
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Décrivez l'objet et les règles de cette élection…"
                className={fieldInputClass()}
                rows={3}
                disabled={loading}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date de début" error={errors.startDate} icon={<Calendar className="w-4 h-4" />}>
                <input
                  type="date"
                  value={data.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                  min={today}
                  className={fieldInputClass()}
                  disabled={loading}
                />
              </Field>
              <Field label="Date de fin" error={errors.endDate} icon={<Calendar className="w-4 h-4" />}>
                <input
                  type="date"
                  value={data.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                  min={data.startDate || today}
                  className={fieldInputClass()}
                  disabled={loading}
                />
              </Field>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading}>
              {loading ? "Création…" : "Créer l'élection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}