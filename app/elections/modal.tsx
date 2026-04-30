"use client";

import React, { useState, useEffect } from "react";
import { X, Vote, Calendar, AlertTriangle, Users } from "lucide-react";
import { Field, fieldInputClass, Button } from "@/components/ui";
import { citizenService } from "@/lib/api/citizen";
import { Citizen, ElectionCandidate } from "@/types/api";

interface ElectionFormData {
  title: string;
  startAt: string;
  endAt: string;
  candidates: ElectionCandidate[];
}

interface ElectionModalProps {
  onClose: () => void;
  onSubmit: (data: ElectionFormData) => Promise<void>;
}

function validate(data: ElectionFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.title.trim()) errors.title = "Le titre est requis";
  else if (data.title.trim().length < 3) errors.title = "Minimum 3 caractères";
  if (!data.startAt) errors.startAt = "Date de début requise";
  if (!data.endAt) errors.endAt = "Date de fin requise";
  else if (data.startAt && new Date(data.endAt) < new Date(data.startAt))
    errors.endAt = "Doit être postérieure à la date de début";
  if (data.candidates.length < 2) errors.candidates = "Sélectionnez au moins 2 candidats";
  return errors;
}

const today = new Date().toISOString().slice(0, 16);

// Format date with seconds and timezone for API compatibility
const formatDateTimeWithSeconds = (dateString: string): string => {
  if (!dateString) return dateString;
  
  // Convert datetime-local (YYYY-MM-DDTHH:mm) to ISO format with seconds and timezone
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  // Add seconds and timezone offset (+00:00 for UTC)
  const isoString = date.toISOString();
  return isoString;
};

export default function ElectionModal({ onClose, onSubmit }: ElectionModalProps) {
  const [data, setData] = useState<ElectionFormData>({
    title: "",
    startAt: "",
    endAt: "",
    candidates: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loadingCitizens, setLoadingCitizens] = useState(false);
  const [cinInput, setCinInput] = useState("");
  const [cinError, setCinError] = useState("");
  const [searchingCin, setSearchingCin] = useState(false);

  useEffect(() => {
    const fetchCitizens = async () => {
      setLoadingCitizens(true);
      try {
        const citizensData = await citizenService.getAll(cinInput);
        setCitizens(citizensData);
      } catch (error) {
        console.error("Failed to fetch citizens:", error);
      } finally {
        setLoadingCitizens(false);
      }
    };
    fetchCitizens();
  }, []);

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
      // Format dates for API compatibility
      const formattedData = {
        ...data,
        startAt: formatDateTimeWithSeconds(data.startAt),
        endAt: formatDateTimeWithSeconds(data.endAt),
      };
      await onSubmit(formattedData);
    } catch {
      setSubmitError("Une erreur est survenue lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCinCandidate = async () => {
    if (!cinInput.trim()) return;
    
    // Check if candidate already selected
    const alreadySelected = data.candidates.some(c => c.gid === cinInput.trim());
    if (alreadySelected) {
      setCinError("Ce candidat est déjà sélectionné");
      return;
    }
    
    setSearchingCin(true);
    setCinError("");
    try {
      const citizen = await citizenService.getByGid(cinInput.trim());
      if (!citizen) {
        setCinError("CIN non trouvé");
      } else {
        setData((prev) => ({
          ...prev,
          candidates: [...prev.candidates, {
            gid: citizen.gid,
            description: `${citizen.firstName} ${citizen.lastName}`
          }]
        }));
        setCinInput("");
        if (errors.candidates) setErrors(prev => ({ ...prev, candidates: "" }));
      }
    } catch (error) {
      console.error("Failed to fetch citizen by CIN:", error);
      setCinError("Erreur lors de la recherche du CIN");
    } finally {
      setSearchingCin(false);
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

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date de début" error={errors.startAt} icon={<Calendar className="w-4 h-4" />}>
                <input
                  type="datetime-local"
                  value={data.startAt}
                  onChange={(e) => set("startAt", e.target.value)}
                  min={today}
                  className={fieldInputClass()}
                  disabled={loading}
                />
              </Field>
              <Field label="Date de fin" error={errors.endAt} icon={<Calendar className="w-4 h-4" />}>
                <input
                  type="datetime-local"
                  value={data.endAt}
                  onChange={(e) => set("endAt", e.target.value)}
                  min={data.startAt || today}
                  className={fieldInputClass()}
                  disabled={loading}
                />
              </Field>
            </div>

            <Field
              label="Candidats"
              error={errors.candidates}
              icon={<Users className="w-4 h-4" />}
              hint="Sélectionnez au moins 2 candidats (CIN requis)"
            >
              {/* Manual CIN Input Section */}
              <div className="mb-4 p-3 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cinInput}
                      onChange={(e) => {
                        setCinInput(e.target.value);
                        setCinError("");
                      }}
                      placeholder="Entrez le CIN du candidat..."
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00843D]/10 transition-all ${
                        cinError 
                          ? "border-red-300 bg-red-300 focus:border-red-500 focus:ring-red-500/10" 
                          : "border-slate-400 bg-white focus:border-[#00843D]"
                      }`}
                      disabled={loading || searchingCin}
                    />
                    {cinError && (
                      <p className="text-xs text-red-600 mt-1">{cinError}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleAddCinCandidate}
                    disabled={!cinInput.trim() || loading || searchingCin}
                    loading={searchingCin}
                  >
                    {searchingCin ? "Recherche..." : "Ajouter"}
                  </Button>
                </div>
              </div>

              {/* Existing Citizens List */}
              {loadingCitizens ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00843D]"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
                  {citizens.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      Aucun candidat selectione
                    </p>
                  ) : (
                    citizens.map((citizen) => {
                      const isSelected = data.candidates.some(c => c.gid === citizen.gid);
                      return (
                        <label
                          key={citizen.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-slate-100"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setData(prev => ({
                                  ...prev,
                                  candidates: [...prev.candidates, {
                                    gid: citizen.gid,
                                    description: `${citizen.firstName} ${citizen.lastName}`
                                  }]
                                }));
                              } else {
                                setData(prev => ({
                                  ...prev,
                                  candidates: prev.candidates.filter(c => c.gid !== citizen.gid)
                                }));
                              }
                              if (errors.candidates) setErrors(prev => ({ ...prev, candidates: "" }));
                            }}
                            className="rounded border-slate-500 text-[#00843D] focus:ring-[#00843D] focus:ring-offset-0 w-4 h-4"
                            disabled={loading}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">
                                {citizen.firstName} {citizen.lastName}
                              </p>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                CIN: {citizen.gid}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Carte d&apos;Identité Nationale: {citizen.gid}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
              {data.candidates.length > 0 && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium text-slate-900">{data.candidates.length}</span>
                    <span className="text-slate-600 ml-1">
                      candidat{data.candidates.length > 1 ? 's' : ''} sélectionné{data.candidates.length > 1 ? 's' : ''}
                    </span>
                    {data.candidates.length < 2 && (
                      <span className="text-amber-600 ml-2 text-xs">
                        (minimum 2 requis)
                      </span>
                    )}
                  </div>
                  {data.candidates.length >= 2 && (
                    <span className="text-green-600 text-xs font-medium">
                      ✓ Minimum requis atteint
                    </span>
                  )}
                </div>
              )}
            </Field>
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