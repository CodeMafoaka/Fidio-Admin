"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, SlidersHorizontal, Vote } from "lucide-react";
import { Election, ElectionStatus } from "@/types";
import { ElectionCandidate } from "@/types/api";
import { Button, EmptyState } from "@/components/ui";
import ElectionCard from "@/app/elections/card";
import ElectionModal from "@/app/elections/modal";
import PageHeader from "@/components/layout/PageHeader";
import { electionService } from "@/lib/api/election";


const STATUS_FILTERS: { value: ElectionStatus | "all"; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Actives" },
  { value: "draft", label: "Brouillons" },
  { value: "completed", label: "Terminées" },
];


export default function ElectionsPage() {
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ElectionStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const electionsData = await electionService.getAll();
        // Convert API elections to local format and fetch vote counts
        const formattedElections = await Promise.all(
          electionsData.map(async (election) => {
            let totalVotes = 0;
            try {
              const result = await electionService.getResult(election.id);
              totalVotes = result.totalVote;
            } catch (error) {
              console.warn(`Failed to fetch results for election ${election.id}:`, error);
            }
            
            return {
              id: election.id,
              title: election.title,
              description: `Élection avec ${election.candidates.length} candidat(s)`,
              startDate: election.startAt.split("T")[0],
              endDate: election.endAt.split("T")[0],
              status: new Date(election.startAt) > new Date() ? "draft" : new Date(election.endAt) < new Date() ? "completed" : "active" as ElectionStatus,
              candidates: election.candidates.length,
              votesOpen: new Date(election.startAt) <= new Date() && new Date(election.endAt) >= new Date(),
              totalVotes,
              createdAt: election.createdAt.split("T")[0],
            };
          })
        );
        setElections(formattedElections);
      } catch (error) {
        console.error("Failed to fetch elections:", error);
        setElections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

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
  const handleCreate = async (data: { title: string; startAt: string; endAt: string; candidates: ElectionCandidate[] }) => {
    try {

      const newElection = await electionService.create(data);
      const formattedElection = {
        id: newElection.id,
        title: newElection.title,
        description: `Élection avec ${newElection.candidates.length} candidat(s)`,
        startDate: newElection.startAt.split("T")[0],
        endDate: newElection.endAt.split("T")[0],
        status: new Date(newElection.startAt) > new Date() ? "draft" : new Date(newElection.endAt) < new Date() ? "completed" : "active" as ElectionStatus,
        candidates: newElection.candidates.length,
        votesOpen: new Date(newElection.startAt) <= new Date() && new Date(newElection.endAt) >= new Date(),
        totalVotes: 0,
        createdAt: newElection.createdAt.split("T")[0],
      };

      setElections((prev) => [formattedElection, ...prev]);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create election:", error);
      throw error;
    }
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
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-700 rounded-xl bg-white focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/10 transition-all"
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
                    : "bg-white border border-slate-700 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00843D]"></div>
            </div>
          ) : filtered.length === 0 ? (
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