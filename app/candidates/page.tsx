"use client";

import { useState } from "react";
import { Plus, Users, Mail, Phone, FileText, Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Shield } from "lucide-react";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  electionId: string;
  electionTitle: string;
  photo?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  votes?: number;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
      bio: "Étudiant en 3ème année de droit, passionné par la vie étudiante et engagé dans plusieurs associations.",
      electionId: "1",
      electionTitle: "Élection du Conseil Étudiant 2024",
      photo: "",
      status: "approved",
      createdAt: "2024-04-15",
      votes: 156
    },
    {
      id: "2", 
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@email.com",
      phone: "+33 6 23 45 67 89",
      bio: "Étudiante en master d'informatique, souhaite améliorer les services numériques pour les étudiants.",
      electionId: "1",
      electionTitle: "Élection du Conseil Étudiant 2024",
      photo: "",
      status: "pending",
      createdAt: "2024-04-18",
      votes: 0
    },
    {
      id: "3",
      firstName: "Pierre",
      lastName: "Bernard",
      email: "pierre.bernard@email.com", 
      phone: "+33 6 34 56 78 90",
      bio: "Étudiant en 2ème année de médecine, représentant des étudiants dans plusieurs commissions.",
      electionId: "2",
      electionTitle: "Élection du Délégué de Classe",
      photo: "",
      status: "rejected",
      createdAt: "2024-04-10",
      votes: 0
    },
    {
      id: "4",
      firstName: "Sophie",
      lastName: "Petit",
      email: "sophie.petit@email.com",
      phone: "+33 6 45 67 89 01",
      bio: "Étudiante en économie, spécialisée dans la gestion de projets associatifs.",
      electionId: "2", 
      electionTitle: "Élection du Délégué de Classe",
      photo: "",
      status: "approved",
      createdAt: "2024-04-12",
      votes: 89
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [electionFilter, setElectionFilter] = useState<string>("all");

  const elections = [
    { id: "1", title: "Élection du Conseil Étudiant 2024" },
    { id: "2", title: "Élection du Délégué de Classe" }
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    
    const matchesElection = electionFilter === "all" || candidate.electionId === electionFilter;
    
    return matchesSearch && matchesStatus && matchesElection;
  });

  const getStatusColor = (status: Candidate["status"]) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Candidate["status"]) => {
    switch (status) {
      case "approved": return "Approuvé";
      case "rejected": return "Rejeté";
      case "pending": return "En attente";
      default: return status;
    }
  };

  const getStatusIcon = (status: Candidate["status"]) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const updateCandidateStatus = (candidateId: string, newStatus: Candidate["status"]) => {
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, status: newStatus }
          : candidate
      )
    );
  };

  const deleteCandidate = (candidateId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) {
      setCandidates(prevCandidates =>
        prevCandidates.filter(candidate => candidate.id !== candidateId)
      );
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
              Gestion des Candidats
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-12">
              Consultez et gérez tous les candidats inscrits aux processus électoraux.
            </p>

            {/* Feature list */}
            <div className="space-y-5">
              {[
                { label: 'Liste complète', sub: 'Vue d\'ensemble de tous les candidats' },
                { label: 'Filtres avancés', sub: 'Recherche et filtrage intelligents' },
                { label: 'Gestion des statuts', sub: 'Validation et rejet rapides' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-white" />
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

      {/* Right: content panel */}
      <div className="flex-1 flex flex-col px-4 py-10 sm:px-8">
        <div className="w-full max-w-6xl mx-auto">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 bg-[#00843D] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Fidio Admin</span>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Candidats</h1>
              <p className="text-sm text-gray-500">
                {filteredCandidates.length} candidat{filteredCandidates.length !== 1 ? 's' : ''} trouvé{filteredCandidates.length !== 1 ? 's' : ''}
              </p>
            </div>
            <a
              href="/candidates/create"
              className="bg-[#00843D] text-white py-3 px-5 rounded-xl font-semibold text-sm
                         hover:bg-[#007034] active:scale-[0.98] transition-all duration-150
                         flex items-center gap-2 shadow-sm shadow-[#00843D]/20"
            >
              <Plus className="w-4 h-4" />
              Nouveau candidat
            </a>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un candidat..."
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
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "approved" | "rejected")}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00843D] appearance-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvés</option>
                  <option value="rejected">Rejetés</option>
                </select>
              </div>

              {/* Election filter */}
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={electionFilter}
                  onChange={(e) => setElectionFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00843D] appearance-none"
                >
                  <option value="all">Toutes les élections</option>
                  {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {candidate.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={candidate.photo} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(candidate.status)}`}>
                          {getStatusIcon(candidate.status)}
                          {getStatusText(candidate.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {candidate.electionTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <a href={`/candidates/edit/${candidate.id}`} className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => deleteCandidate(candidate.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{candidate.phone}</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{candidate.bio}</p>
                </div>

                {/* Bottom info */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Créé le {new Date(candidate.createdAt).toLocaleDateString('fr-FR')}</span>
                    {candidate.votes !== undefined && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {candidate.votes} votes
                      </span>
                    )}
                  </div>

                  {/* Status actions */}
                  {candidate.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateCandidateStatus(candidate.id, "approved")}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => updateCandidateStatus(candidate.id, "rejected")}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        Rejeter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredCandidates.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun candidat trouvé</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all" || electionFilter !== "all" 
                    ? "Essayez d'ajuster vos filtres pour voir plus de résultats"
                    : "Commencez par ajouter votre premier candidat"
                  }
                </p>
                <a
                  href="/candidates/create"
                  className="bg-[#00843D] text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-[#007034] transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un candidat
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
