import { useState, useEffect, useCallback } from "react";
import {
  electionService,
  citizenService,
  authService,
  voteService,
} from "@/lib/api";
import {
  Election,
  CreateElection,
  Citizen,
  CreateCitizen,
  UpdateCitizen,
  ElectionResult,
  LoginRequest,
  AuthResponse,
  CreateVote,
} from "@/types/api";

// Types génériques pour les états de chargement
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook pour les élections
export function useElections() {
  const [state, setState] = useState<ApiState<Election[]>>({
    data: null,
    loading: false,
    error: null,
    refetch: async () => {},
  });

  const fetchElections = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const elections = await electionService.getAll();
      setState((prev) => ({
        ...prev,
        data: elections,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const createElection = useCallback(
    async (electionData: CreateElection) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        await electionService.create(electionData);
        await fetchElections(); // Rafraîchir la liste
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors de la création",
          loading: false,
        }));
        throw error;
      }
    },
    [fetchElections],
  );

  return {
    ...state,
    createElection,
  };
}

// Hook pour une élection spécifique
export function useElection(id: string) {
  const [state, setState] = useState<ApiState<Election>>({
    data: null,
    loading: false,
    error: null,
    refetch: async () => {},
  });

  const fetchElection = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const election = await electionService.getById(id);
      setState((prev) => ({
        ...prev,
        data: election,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Élection non trouvée",
        loading: false,
      }));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchElection();
    }
  }, [id, fetchElection]);

  return state;
}

// Hook pour les résultats d'élection
export function useElectionResult(electionId: string) {
  const [state, setState] = useState<ApiState<ElectionResult>>({
    data: null,
    loading: false,
    error: null,
    refetch: async () => {},
  });

  const fetchResult = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await electionService.getResult(electionId);
      setState((prev) => ({
        ...prev,
        data: result,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Résultat non disponible",
        loading: false,
      }));
    }
  }, [electionId]);

  useEffect(() => {
    if (electionId) {
      fetchResult();
    }
  }, [electionId, fetchResult]);

  return state;
}

// Hook pour les citoyens
export function useCitizens(gid?: string, id?: string) {
  const [state, setState] = useState<ApiState<Citizen[]>>({
    data: null,
    loading: false,
    error: null,
    refetch: async () => {},
  });

  const fetchCitizens = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const citizens = await citizenService.getAll(gid, id);
      setState((prev) => ({
        ...prev,
        data: citizens,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Erreur de chargement",
        loading: false,
      }));
    }
  }, [gid, id]);

  useEffect(() => {
    fetchCitizens();
  }, [fetchCitizens]);

  const createCitizen = useCallback(async (citizenData: CreateCitizen) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const citizen = await citizenService.create(citizenData);
      setState((prev) => ({
        ...prev,
        data: prev.data ? [...prev.data, citizen] : [citizen],
        loading: false,
      }));
      return citizen;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Erreur lors de la création",
        loading: false,
      }));
      throw error;
    }
  }, []);

  const updateCitizen = useCallback(async (citizenData: UpdateCitizen) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const updatedCitizen = await citizenService.update(citizenData);
      setState((prev) => ({
        ...prev,
        data:
          prev.data?.map((c) =>
            c.id === citizenData.id ? updatedCitizen : c,
          ) || null,
        loading: false,
      }));
      return updatedCitizen;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour",
        loading: false,
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    createCitizen,
    updateCitizen,
  };
}

// Hook d'authentification
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Citizen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          // Vérifier la validité du token en récupérant l'utilisateur
          const userData = await authService.whoami();
          setUser(userData);
          setIsAuthenticated(true);
        } catch {
          authService.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<AuthResponse> => {
      try {
        const response = await authService.login(credentials);
        authService.setToken(response.token);
        setIsAuthenticated(true);

        // Récupérer les infos utilisateur
        const userData = await authService.whoami();
        setUser(userData);

        return response;
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        throw error;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
}

// Hook pour les votes
export function useVotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVote = useCallback(async (voteData: CreateVote) => {
    setLoading(true);
    setError(null);
    try {
      await voteService.create(voteData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors du vote");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createVote,
    loading,
    error,
  };
}
