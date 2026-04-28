"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, SlidersHorizontal, Vote } from "lucide-react";
import { Election, ElectionStatus } from "@/types";
import { Button, EmptyState } from "@/components/ui";
import ElectionCard from "@/app/elections/card";
import ElectionModal from "@/app/elections/modal";
import PageHeader from "@/components/layout/PageHeader";

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED: Election[] = [
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
    createdAt: "2024-04-10",
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
    createdAt: "2024-04-18",
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
    createdAt: "2024-03-01",
  },
];

// ─── Filter bar ───────────────────────────────────────────────────────────────

const STATUS_FILTERS: { value: ElectionStatus | "all"; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Actives" },
  { value: "draft", label: "Brouillons" },
  { value: "completed", label: "Terminées" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ElectionsPage() {
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>(SEED);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ElectionStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);

  // Derived stats
  const stats = useMemo(() => ({
    total: elections.length,
    active: elections.filter((e) => e.status === "active").length,
    votes: elections.reduce((s, e) => s + (e.totalVotes ?? 0), 0),
  }), [elections]);

  // Filtered list
  const filtered = useMemo(
    () =>
      elections.filter((e) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || e.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [elections, search, statusFilter]
  );

  // Handlers
  const handleCreate = async (data: { title: string; description: string; startDate: string; endDate: string }) => {
    await new Promise((r) => setTimeout(r, 800));
    const newElection: Election = {
      id: Date.now().toString(),
      ...data,
      title: data.title.trim(),
      description: data.description.trim(),
      status: "draft",
      candidates: 0,
      votesOpen: false,
      totalVotes: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setElections((prev) => [newElection, ...prev]);
    setShowModal(false);
  };

  const updateStatus = (id: string, status: Election["status"]) =>
    setElections((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));

  const toggleVotes = (id: string) =>
    setElections((prev) => prev.map((e) => (e.id === id ? { ...e, votesOpen: !e.votesOpen } : e)));

  const deleteElection = (id: string) => {
    if (!confirm("Supprimer cette élection définitivement ?")) return;
    setElections((prev) => prev.filter((e) => e.id !== id));
  };

  const viewElection = (id: string) => {
    router.push(`/elections/${id}`);
  };

  return (
    <div >
      <div className="min-h-full">
        {/* Page header */}
        <PageHeader
          title="Élections"
          description="Gérez et suivez tous les processus électoraux"
          stats={[
            { label: "Total", value: stats.total },
            { label: "Actives", value: stats.active },
            { label: "Votes totaux", value: stats.votes },
          ]}
          actions={
            <Button
              onClick={() => setShowModal(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Nouvelle élection
            </Button>
          }
        />

        {/* Toolbar */}
        <div className="px-8 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center border-b border-slate-100 bg-white/70 backdrop-blur sticky top-0 z-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Rechercher une élection…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/10 transition-all"
            />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === f.value
                    ? "bg-[#00843D] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="px-8 py-6">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Vote className="w-8 h-8" />}
              title="Aucune élection trouvée"
              description={
                search || statusFilter !== "all"
                  ? "Ajustez vos filtres pour voir plus de résultats."
                  : "Commencez par créer votre première élection."
              }
              action={
                <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
                  Créer une élection
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  onActivate={(id) => updateStatus(id, "active")}
                  onComplete={(id) => updateStatus(id, "completed")}
                  onToggleVotes={toggleVotes}
                  onDelete={deleteElection}
                  onView={viewElection}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ElectionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}