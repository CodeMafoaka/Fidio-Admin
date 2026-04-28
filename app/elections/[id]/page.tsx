"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Users, Vote, Eye, CheckCircle, Clock, EyeOff, BarChart3, TrendingUp } from "lucide-react";
import { Election } from "@/types";
import { ElectionResult, Citizen } from "@/types/api";

// Type for candidate with election results
interface CandidateWithResult {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  description: string;
}
import { Button, StatusBadge } from "@/components/ui";
import PageHeader from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/utils";
import { electionService } from "@/lib/api/election";
import { citizenService } from "@/lib/api/citizen";



export default function ElectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const electionId = params.id as string;

  const [election, setElection] = useState<Election | null>(null);
  const [electionResult, setElectionResult] = useState<ElectionResult | null>(null);
  const [candidates, setCandidates] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch election details
        const electionData = await electionService.getById(electionId);
        
        // Convert API election to local format
        const formattedElection = {
          id: electionData.id,
          title: electionData.title,
          description: `Élection avec ${electionData.candidates.length} candidat(s)`,
          startDate: electionData.startAt.split("T")[0],
          endDate: electionData.endAt.split("T")[0],
          status: new Date(electionData.startAt) > new Date() ? "draft" : new Date(electionData.endAt) < new Date() ? "completed" : "active" as Election["status"],
          candidates: electionData.candidates.length,
          votesOpen: new Date(electionData.startAt) <= new Date() && new Date(electionData.endAt) >= new Date(),
          totalVotes: 0,
          createdAt: electionData.createdAt.split("T")[0],
        };
        
        setElection(formattedElection);
        
        // Fetch election results
        try {
          const resultData = await electionService.getResult(electionId);
          setElectionResult(resultData);
          formattedElection.totalVotes = resultData.totalVote;
        } catch (resultError) {
          console.warn("Failed to fetch election results:", resultError);
        }
        
        // Fetch candidate details
        const candidatePromises = electionData.candidates.map(async (candidate) => {
          try {
            const citizenData = await citizenService.getByGid(candidate.gid);
            return citizenData;
          } catch (citizenError) {
            console.warn(`Failed to fetch citizen for GID ${candidate.gid}:`, citizenError);
            return null;
          }
        });
        
        const candidateData = await Promise.all(candidatePromises);
        setCandidates(candidateData.filter((c): c is Citizen => c !== null));
        
      } catch (err) {
        console.error("Failed to fetch election:", err);
        setError(err instanceof Error ? err.message : "Failed to load election");
      } finally {
        setLoading(false);
      }
    };
    
    fetchElectionData();
  }, [electionId]);

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

  // Calculer les données des candidats avec les résultats
  const candidatesWithResults = useMemo((): CandidateWithResult[] => {
    if (!electionResult || candidates.length === 0) return [];
    
    return candidates.map((candidate) => {
      const candidateResult = electionResult.candidateResults.find(
        (cr) => cr.candidateGid === candidate.gid
      );
      
      const votes = candidateResult?.voteAmount || 0;
      const percentage = electionResult.totalVote > 0 ? (votes / electionResult.totalVote) * 100 : 0;
      
      return {
        id: candidate.id,
        name: `${candidate.firstName} ${candidate.lastName}`,
        votes,
        percentage: Math.round(percentage * 10) / 10,
        description: `CIN: ${candidate.gid}`,
      };
    });
  }, [electionResult, candidates]);

  if (loading) {
    return (
      <div className="min-h-full">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Chargement...</h1>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00843D] mx-auto mb-4"></div>
            <p className="text-slate-500">Chargement des détails de l'élection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="min-h-full">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Élection non trouvée</h1>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
            <p className="text-slate-500">{error || "L'élection demandée n'existe pas ou a été supprimée."}</p>
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
          </div>
        }
      />

      <div className="px-8 py-6 space-y-6">
        {/* Status and dates card */}
        <div className="bg-white rounded-2xl border border-slate-400 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <StatusBadge status={election.status} type="election" />
                {election.status === "active" && (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      election.votesOpen
                        ? "bg-emerald-200 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
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
          <div className="bg-white rounded-2xl border border-slate-400 p-6">
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

          <div className="bg-white rounded-2xl border border-slate-400 p-6">
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

          <div className="bg-white rounded-2xl border border-slate-400 p-6">
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
        <div className="bg-white rounded-2xl border border-slate-400 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Candidats</h2>
          
          {candidatesWithResults.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                {electionResult ? "Aucun candidat trouvé pour cette élection." : "Les résultats des candidats ne sont pas encore disponibles."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidatesWithResults.map((candidate, index) => (
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
                    <div className="w-full bg-slate-300 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-[#00843D] to-[#E8291E] h-2 rounded-full"
                        style={{ width: `${candidate.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
