"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Users, Vote, Eye, Edit, CheckCircle, Clock, EyeOff, Plus, BarChart3, TrendingUp } from "lucide-react";
import { Election } from "@/types";
import { Button, StatusBadge } from "@/components/ui";
import PageHeader from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/utils";


const MOCK_ELECTIONS: Election[] = [
  {
    id: "1",
    title: "Élection du Conseil Étudiant 2024",
    description: "Vote pour élire les nouveaux membres du conseil étudiant pour l`année académique 2024-2025. Cette élection est cruciale pour la représentation étudiante au sein de l`établissement.",
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
    description: "Choix du délégué pour la promotion 2024-2025. Le délégué sera responsable de la communication entre les étudiants et l`administration.",
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
    description: "Sélection du représentant des activités sportives universitaires. Cette personne coordonnera les événements sportifs et représentera les étudiants dans les compétitions.",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    status: "completed",
    candidates: 3,
    votesOpen: false,
    totalVotes: 89,
    createdAt: "2024-03-01",
  },
];

// ─── Mock candidates data ───────────────────────────────────────────────────────

const MOCK_CANDIDATES = [
  { id: "1", name: "Marie Dubois", votes: 45, percentage: 28.8, description: "Étudiante en 3ème année de droit" },
  { id: "2", name: "Pierre Martin", votes: 38, percentage: 24.4, description: "Étudiant en 2ème année de sciences" },
  { id: "3", name: "Sophie Bernard", votes: 32, percentage: 20.5, description: "Étudiante en 4ème année de médecine" },
  { id: "4", name: "Lucas Petit", votes: 28, percentage: 17.9, description: "Étudiant en 1ère année d`économie" },
  { id: "5", name: "Emma Leroy", votes: 13, percentage: 8.3, description: "Étudiante en 2ème année de lettres" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ElectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const electionId = params.id as string;

  const [election] = useState<Election | null>(
    MOCK_ELECTIONS.find(e => e.id === electionId) || null
  );

  const [candidates] = useState(MOCK_CANDIDATES);

  // Calculer les stats avant le retour conditionnel pour respecter les règles des hooks
  const stats = useMemo(() => {
    if (!election) {
      return {
        participation: 0,
        daysRemaining: 0,
        averageVotesPerCandidate: 0,
      };
    }
    return {
      participation: election.totalVotes ? Math.round((election.totalVotes / 1000) * 100) : 0,
      daysRemaining: Math.max(0, Math.ceil((new Date(election.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
      averageVotesPerCandidate: election.candidates > 0 ? Math.round((election.totalVotes || 0) / election.candidates) : 0,
    };
  }, [election]);

  if (!election) {
    return (
      <div className="min-h-full">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Élection non trouvée</h1>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
            <p className="text-slate-500">L`élection demandée n`existe pas ou a été supprimée.</p>
            <Button
              onClick={() => router.push("/elections")}
              className="mt-4"
            >
              Retour aux élections
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Page header */}
      <PageHeader
        title={election.title}
        description={election.description}
        stats={[
          { label: "Candidats", value: election.candidates },
          { label: "Votes", value: election.totalVotes || 0 },
          { label: "Participation", value: stats.participation },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push("/elections")}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Retour
            </Button>
            {/* <Button
              icon={<Edit className="w-4 h-4" />}
            >
              Modifier
            </Button> */}
          </div>
        }
      />

      <div className="px-8 py-6 space-y-6">
        {/* Status and dates card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <StatusBadge status={election.status} type="election" />
                {election.status === "active" && (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      election.votesOpen
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        election.votesOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                    />
                    {election.votesOpen ? "Votes ouverts" : "Votes fermés"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(election.startDate)} → {formatDate(election.endDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {election.candidates} candidat{election.candidates !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Vote className="w-4 h-4" />
                  {election.totalVotes || 0} vote{(election.totalVotes || 0) !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {election.status === "draft" && (
                <Button
                  size="sm"
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  Activer
                </Button>
              )}
              {election.status === "active" && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Clock className="w-4 h-4" />}
                  >
                    Terminer
                  </Button>
                  <Button
                    size="sm"
                    variant={election.votesOpen ? "danger" : "primary"}
                    icon={election.votesOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  >
                    {election.votesOpen ? "Fermer votes" : "Ouvrir votes"}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Progression</span>
              <span>{stats.daysRemaining} jour{stats.daysRemaining !== 1 ? "s" : ""} restant{stats.daysRemaining !== 1 ? "s" : ""}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-linear-to-r from-[#00843D] to-[#E8291E] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, 100 - stats.daysRemaining * 5))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Participation</p>
                <p className="text-2xl font-bold text-slate-900">{stats.participation}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Moyenne par candidat</p>
                <p className="text-2xl font-bold text-slate-900">{stats.averageVotesPerCandidate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Temps restant</p>
                <p className="text-2xl font-bold text-slate-900">{stats.daysRemaining}j</p>
              </div>
            </div>
          </div>
        </div>

        {/* Candidates section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          

          <div className="space-y-3">
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{candidate.name}</h3>
                  <p className="text-sm text-slate-500">{candidate.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{candidate.votes} votes</p>
                  <p className="text-sm text-slate-500">{candidate.percentage}%</p>
                </div>
                <div className="w-20">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-[#00843D] to-[#E8291E] h-2 rounded-full"
                      style={{ width: `${candidate.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
