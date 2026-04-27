"use client";

import { useState } from "react";
import { Plus, Calendar, Users, Vote, CheckCircle, AlertCircle, ArrowRight, Shield, Eye, EyeOff, Search, Filter, Edit, Trash2, Clock } from "lucide-react";

interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "completed";
  candidates: number;
  votesOpen: boolean;
  totalVotes?: number;
  createdAt: string;
}

export default function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>([
    {
      id: "1",
      title: "Élection du Conseil Étudiant 2024",
      description: "Vote pour élire les nouveaux membres du conseil étudiant",
      startDate: "2024-05-01",
      endDate: "2024-05-15",
      status: "active",
      candidates: 8,
      votesOpen: true,
      totalVotes: 156,
      createdAt: "2024-04-10"
    },
    {
      id: "2", 
      title: "Élection du Délégué de Classe",
      description: "Choix du délégué pour la promotion 2024-2025",
      startDate: "2024-06-01",
      endDate: "2024-06-03",
      status: "draft",
      candidates: 5,
      votesOpen: false,
      totalVotes: 0,
      createdAt: "2024-04-18"
    },
    {
      id: "3",
      title: "Élection du Représentant Sportif",
      description: "Sélection du représentant des activités sportives universitaires",
      startDate: "2024-03-15",
      endDate: "2024-03-20",
      status: "completed",
      candidates: 3,
      votesOpen: false,
      totalVotes: 89,
      createdAt: "2024-03-01"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "active" | "completed">("all");

  const filteredElections = elections.filter(election => {
    const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || election.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Le titre est requis";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Le titre doit contenir au moins 3 caractères";
    }
    
    if (!formData.description.trim()) {
      errors.description = "La description est requise";
    } else if (formData.description.trim().length < 10) {
      errors.description = "La description doit contenir au moins 10 caractères";
    }
    
    if (!formData.startDate) {
      errors.startDate = "La date de début est requise";
    }
    
    if (!formData.endDate) {
      errors.endDate = "La date de fin est requise";
    } else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = "La date de fin doit être postérieure à la date de début";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Simuler une API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newElection: Election = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: "draft",
        candidates: 0,
        votesOpen: false,
        totalVotes: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setElections([...elections, newElection]);
      setFormData({ title: "", description: "", startDate: "", endDate: "" });
      setFormErrors({});
      setShowForm(false);
    } catch {
      setFormErrors({ submit: "Une erreur est survenue lors de la création de l election" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({...formErrors, [field]: ""});
    }
  };

  const updateElectionStatus = (electionId: string, newStatus: Election["status"]) => {
    setElections(prevElections =>
      prevElections.map(election =>
        election.id === electionId
          ? { ...election, status: newStatus }
          : election
      )
    );
  };

  const deleteElection = (electionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette élection ?")) {
      setElections(prevElections =>
        prevElections.filter(election => election.id !== electionId)
      );
    }
  };

  const toggleVotes = (electionId: string) => {
    setElections(prevElections => 
      prevElections.map(election => 
        election.id === electionId 
          ? { ...election, votesOpen: !election.votesOpen }
          : election
      )
    );
  };

  const getStatusColor = (status: Election["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Election["status"]) => {
    switch (status) {
      case "active": return "Active";
      case "completed": return "Terminée";
      case "draft": return "Brouillon";
      default: return status;
    }
  };

  const getStatusIcon = (status: Election["status"]) => {
    switch (status) {
      case "active": return <CheckCircle className="w-3 h-3" />;
      case "completed": return <Clock className="w-3 h-3" />;
      case "draft": return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className="min-h-screen flex bg-[#f5f5f5]">
      
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-105 xl:w-120 shrink-0 flex-col bg-[#00843D] relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(0,0,0,0.12) 0%, transparent 50%)`,
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/10" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border border-white/10" />

        {/* Red accent stripe at top */}
        <div className="h-1 w-full bg-[#FC3D32] relative z-10" />

        <div className="relative z-10 flex flex-col h-full px-10 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-[#00843D]" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Fidio Admin</span>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-10 h-1 bg-[#FC3D32] rounded mb-6" />
            <h2 className="text-white text-3xl xl:text-4xl font-bold leading-tight mb-5">
              Gestion des Élections
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-12">
              Créez et gérez les processus électoraux avec une interface moderne et sécurisée.
            </p>

            {/* Feature list */}
            <div className="space-y-5">
              {[
                { label: 'Création d élections simplifiée', sub: 'Interface intuitive et rapide' },
                { label: 'Suivi en temps réel', sub: 'Statuts et résultats instantanés' },
                { label: 'Sécurité renforcée', sub: 'Votes et données protégés' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{f.label}</p>
                    <p className="text-white/50 text-xs mt-0.5">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/50 text-xs">&copy; {new Date().getFullYear()} Fidio. Tous droits réservés.</p>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[440px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 bg-[#00843D] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Fidio Admin</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Gestion des Élections</h1>
            <p className="text-sm text-gray-500">
              {filteredElections.length} élection{filteredElections.length !== 1 ? 's' : ''} trouvée{filteredElections.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une élection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00843D]"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "draft" | "active" | "completed")}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00843D] appearance-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="draft">Brouillons</option>
                  <option value="active">Actives</option>
                  <option value="completed">Terminées</option>
                </select>
              </div>
            </div>
          </div>

          {/* Elections List */}
          <div className="space-y-4 mb-8">
            {filteredElections.map((election) => (
              <div key={election.id} className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{election.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{election.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(election.status)}`}>
                        {getStatusIcon(election.status)}
                        {getStatusText(election.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Créée le {new Date(election.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteElection(election.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Du {election.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Au {election.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{election.candidates} candidats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Vote className="w-3 h-3" />
                    <span>{election.totalVotes || 0} votes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${election.votesOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={election.votesOpen ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {election.votesOpen ? 'Votes ouverts' : 'Votes fermés'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Voir les détails
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 font-medium text-xs flex items-center gap-1">
                    <Edit className="w-3 h-3" />
                    Modifier
                  </button>
                  {election.status === "draft" && (
                    <button 
                      onClick={() => updateElectionStatus(election.id, "active")}
                      className="text-green-600 hover:text-green-700 font-medium text-xs flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Activer
                    </button>
                  )}
                  {election.status === "active" && (
                    <button 
                      onClick={() => updateElectionStatus(election.id, "completed")}
                      className="text-orange-600 hover:text-orange-700 font-medium text-xs flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      Terminer
                    </button>
                  )}
                  {election.status === "active" && (
                    <button 
                      onClick={() => toggleVotes(election.id)}
                      className={`font-medium text-xs flex items-center gap-1 ${
                        election.votesOpen 
                          ? 'text-orange-600 hover:text-orange-700' 
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      {election.votesOpen ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Fermer les votes
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          Ouvrir les votes
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredElections.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-12 text-center">
                <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune élection trouvée</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Essayez d'ajuster vos filtres pour voir plus de résultats"
                    : "Commencez par créer votre première élection"
                  }
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#00843D] text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-[#007034] transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Créer une élection
                </button>
              </div>
            )}
          </div>

          {/* Create Election Button */}
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#00843D] text-white py-3 px-5 rounded-xl font-semibold text-sm
                       hover:bg-[#007034] active:scale-[0.98] transition-all duration-150
                       flex items-center justify-center gap-2 shadow-sm shadow-[#00843D]/20"
          >
            <Plus className="w-4 h-4" />
            Créer une nouvelle élection
          </button>

        </div>
      </div>

      {/* Create Election Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            {/* Top accent */}
            <div className="h-0.5 bg-gradient-to-r from-[#00843D] via-[#00843D] to-[#FC3D32]" />

            <div className="p-7">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#00843D]" />
                  Créer une nouvelle élection
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: "", description: "", startDate: "", endDate: "" });
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {formErrors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formErrors.submit}
                  </div>
                )}

                {/* Title */}
                <Field
                  label="Titre de l election"
                  error={formErrors.title}
                  icon={<Vote className="w-4 h-4" />}
                >
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ex: Élection du Conseil Étudiant 2024"
                    className={fieldClass(!!formErrors.title)}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Description */}
                <Field
                  label="Description"
                  error={formErrors.description}
                  icon={<Calendar className="w-4 h-4" />}
                >
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Décrivez en détail l objet et les règles de cette élection..."
                    className={fieldClass(!!formErrors.description)}
                    rows={4}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Date de début"
                    error={formErrors.startDate}
                    icon={<Calendar className="w-4 h-4" />}
                  >
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className={fieldClass(!!formErrors.startDate)}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={isSubmitting}
                    />
                  </Field>

                  <Field
                    label="Date de fin"
                    error={formErrors.endDate}
                    icon={<Calendar className="w-4 h-4" />}
                  >
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      className={fieldClass(!!formErrors.endDate)}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      disabled={isSubmitting}
                    />
                  </Field>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00843D] text-white py-3 px-5 rounded-xl font-semibold text-sm
                             hover:bg-[#007034] active:scale-[0.98] transition-all duration-150
                             flex items-center justify-center gap-2 shadow-sm shadow-[#00843D]/20
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Créer l election
                    </>
                  )}
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: "", description: "", startDate: "", endDate: "" });
                    setFormErrors({});
                  }}
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm
                             hover:bg-gray-50 active:scale-[0.98] transition-all duration-150
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  Annuler
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return `w-full text-sm text-gray-900 bg-transparent border-0 outline-none placeholder-gray-400
    ${hasError ? '' : ''}`;
}

function Field({
  label, error, icon, suffix, children
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-colors
        ${error
          ? 'border-[#FC3D32] bg-[#FC3D32]/[0.03]'
          : 'border-gray-200 bg-gray-50/50 focus-within:border-[#00843D] focus-within:bg-white'
        }`}
      >
        {icon && <span className={error ? 'text-[#FC3D32]' : 'text-gray-400'}>{icon}</span>}
        <div className="flex-1">{children}</div>
        {suffix}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FC3D32]">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
