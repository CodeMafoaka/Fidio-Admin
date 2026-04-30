"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Vote, CheckCircle, Shield, Clock, RefreshCw, Filter } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  color: string;
}

interface ElectionResult {
  id: string;
  title: string;
  status: "active" | "completed";
  totalVotes: number;
  candidates: Candidate[];
  lastUpdate: string;
}

export default function ResultsPage() {
  const [selectedElection, setSelectedElection] = useState<string>("1");
  const [isLive, setIsLive] = useState(true);
  
  // Initialiser les résultats avec des valeurs de tendance
  const initialResults: ElectionResult[] = [
    {
      id: "1",
      title: "Élection du Conseil Étudiant 2024",
      status: "active",
      totalVotes: 1247,
      lastUpdate: new Date().toLocaleTimeString(),
      candidates: [
        { id: "1", name: "Marie Dubois", votes: 523, percentage: 42.0, color: "bg-blue-500" },
        { id: "2", name: "Pierre Martin", votes: 389, percentage: 31.2, color: "bg-green-500" },
        { id: "3", name: "Sophie Bernard", votes: 335, percentage: 26.8, color: "bg-purple-500" }
      ]
    },
    {
      id: "2",
      title: "Élection du Délégué de Classe",
      status: "completed",
      totalVotes: 89,
      lastUpdate: "14:32:15",
      candidates: [
        { id: "1", name: "Lucas Petit", votes: 45, percentage: 50.6, color: "bg-orange-500" },
        { id: "2", name: "Emma Rousseau", votes: 44, percentage: 49.4, color: "bg-pink-500" }
      ]
    }
  ];

  // Initialiser les états avec les valeurs de tendance
  const [results, setResults] = useState<ElectionResult[]>(initialResults);
  const [trendValues, setTrendValues] = useState<{[key: string]: number}>(() => {
    const initialTrends: {[key: string]: number} = {};
    initialResults.forEach((result: ElectionResult) => {
      result.candidates.slice(0, 2).forEach((candidate: Candidate) => {
        initialTrends[`${result.id}-${candidate.id}`] = Math.floor(Math.random() * 20 + 5);
      });
    });
    return initialTrends;
  });

  // Simulation de mises à jour en temps réel
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setResults((prevResults: ElectionResult[]) => 
        prevResults.map((result: ElectionResult) => {
          if (result.status !== "active") return result;
          
          const updatedCandidates = result.candidates.map((candidate: Candidate) => ({
            ...candidate,
            votes: candidate.votes + Math.floor(Math.random() * 3),
            percentage: 0 // Sera recalculé
          }));
          
          const totalNewVotes = updatedCandidates.reduce((sum: number, c: Candidate) => sum + c.votes, 0);
          
          return {
            ...result,
            totalVotes: totalNewVotes,
            lastUpdate: new Date().toLocaleTimeString(),
            candidates: updatedCandidates.map((candidate: Candidate) => ({
              ...candidate,
              percentage: totalNewVotes > 0 ? (candidate.votes / totalNewVotes) * 100 : 0
            }))
          };
        })
      );

      // Mettre à jour les valeurs de tendance
      setTrendValues((prev: {[key: string]: number}) => {
        const newTrends = { ...prev };
        results.forEach((result: ElectionResult) => {
          if (result.status === "active") {
            result.candidates.slice(0, 2).forEach((candidate: Candidate) => {
              const key = `${result.id}-${candidate.id}`;
              newTrends[key] = Math.floor(Math.random() * 20 + 5);
            });
          }
        });
        return newTrends;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, results]);

  const currentElection = results.find((r: ElectionResult) => r.id === selectedElection);

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
              Résultats en Temps Réel
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-12">
              Suivez l évolution des votes et analysez les résultats électoraux instantanément.
            </p>

            {/* Feature list */}
            <div className="space-y-5">
              {[
                { label: 'Mises à jour instantanées', sub: 'Données en temps réel' },
                { label: 'Visualisations claires', sub: 'Graphiques et statistiques' },
                { label: 'Analyse détaillée', sub: 'Pourcentages et tendances' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
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

      {/* Right: results panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-300">

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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Résultats en Temps Réel</h1>
              <p className="text-sm text-gray-500">
                Suivez l évolution des votes en direct
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isLive 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {isLive ? 'En direct' : 'En pause'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filtrer
              </button>
            </div>
          </div>

          {/* Election Selector */}
          <div className="flex gap-4 mb-8">
            {results.map((result: ElectionResult) => (
              <button
                key={result.id}
                onClick={() => setSelectedElection(result.id)}
                className={`flex-1 p-4 rounded-xl border transition-colors ${
                  selectedElection === result.id
                    ? 'border-[#00843D] bg-[#00843D]/2'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{result.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {result.status === 'active' ? 'Active' : 'Terminée'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Vote className="w-3 h-3" />
                    <span>{result.totalVotes} votes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{result.lastUpdate}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {currentElection && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Vote className="w-4 h-4 text-[#00843D]" />
                      <span className="text-xs font-medium text-gray-600">Total Votes</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{currentElection.totalVotes}</p>
                    <p className="text-xs text-green-600 mt-1">+12 depuis 5min</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-gray-600">Candidats</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{currentElection.candidates.length}</p>
                    <p className="text-xs text-gray-500 mt-1">En compétition</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200/80">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="text-xs font-medium text-gray-600">Participation</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">67%</p>
                    <p className="text-xs text-orange-600 mt-1">Objectif: 75%</p>
                  </div>
                </div>

                {/* Results Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200/80">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Résultats par Candidat</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {currentElection.candidates
                      .sort((a: Candidate, b: Candidate) => b.votes - a.votes)
                      .map((candidate: Candidate, index: number) => (
                        <div key={candidate.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${candidate.color} flex items-center justify-center text-white text-sm font-bold`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{candidate.name}</p>
                                <p className="text-xs text-gray-500">{candidate.votes} votes</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-gray-900">{candidate.percentage.toFixed(1)}%</p>
                              {index === 0 && currentElection.status === 'active' && (
                                <p className="text-xs text-green-600 font-medium">En tête</p>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${candidate.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${candidate.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Trend Analysis */}
                <div className="bg-white rounded-xl p-6 border border-gray-200/80">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse des Tendances</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentElection.candidates.slice(0, 2).map((candidate: Candidate) => (
                      <div key={candidate.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900 mb-2">{candidate.name}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-green-600">
                            +{trendValues[`${currentElection.id}-${candidate.id}`] || 0}%
                          </span>
                          <span className="text-gray-500">dernière heure</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Live Updates */}
                <div className="bg-white rounded-xl p-6 border border-gray-200/80">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mises à Jour Récentes</h3>
                  <div className="space-y-3">
                    {[
                      { time: '14:45:23', action: 'Nouveau vote pour Marie Dubois', type: 'vote' },
                      { time: '14:45:18', action: 'Nouveau vote pour Pierre Martin', type: 'vote' },
                      { time: '14:45:12', action: 'Nouveau vote pour Sophie Bernard', type: 'vote' },
                      { time: '14:45:05', action: 'Taux de participation mis à jour', type: 'stats' }
                    ].map((update, index) => (
                      <div key={index} className="flex gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          update.type === 'vote' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-gray-700">{update.action}</p>
                          <p className="text-xs text-gray-500">{update.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 border border-gray-200/80">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                  <div className="space-y-3">
                    <button className="w-full py-2 px-4 bg-[#00843D] text-white rounded-lg font-medium text-sm hover:bg-[#007034] transition-colors">
                      Exporter les Résultats
                    </button>
                    <button className="w-full py-2 px-4 border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
                      Générer un Rapport
                    </button>
                    <button className="w-full py-2 px-4 border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
                      Partager les Résultats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
