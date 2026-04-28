import {
  LoginRequest,
  AuthResponse,
  CreateCitizen,
  UpdateCitizen,
  Citizen,
  CreateElection,
  Election,
  ElectionResult,
  CreateVote,
  ApiError,
} from "@/types/api";

// Configuration de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper pour gérer les réponses API avec logging détaillé
async function handleApiResponse<T>(
  response: Response,
  endpoint: string,
): Promise<T> {
  console.log(`🔍 API Response for ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  if (!response.ok) {
    const errorData: ApiError = await response
      .json()
      .catch(() => ({ message: "Erreur réseau" }));

    console.error(`❌ API Error for ${endpoint}:`, {
      status: response.status,
      errorData,
    });

    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  let data: T;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = response.text() as unknown as T;
  }

  console.log(`✅ API Success for ${endpoint}:`, data);
  return data;
}

// Service d'authentification avec fetch séparés pour debug
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log("🔐 AUTH: Login attempt", {
      credentials: { ...credentials, password: "[HIDDEN]" },
    });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ AUTH: Login failed", {
          status: response.status,
          errorData,
        });
        throw new Error(
          errorData.message || `Login failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ AUTH: Login successful", {
        token: data.token ? "[RECEIVED]" : "[MISSING]",
      });
      return data;
    } catch (error) {
      console.error("💥 AUTH: Login network error", error);
      throw error;
    }
  },

  async register(userData: CreateCitizen): Promise<Citizen> {
    console.log("👤 AUTH: Register attempt", {
      userData: { ...userData, password: "[HIDDEN]" },
    });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ AUTH: Register failed", {
          status: response.status,
          errorData,
        });
        throw new Error(
          errorData.message || `Register failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ AUTH: Register successful", {
        userId: data.id,
        role: data.role,
      });
      return data;
    } catch (error) {
      console.error("💥 AUTH: Register network error", error);
      throw error;
    }
  },

  async whoami(): Promise<Citizen> {
    console.log("🔍 AUTH: Whoami request");
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.warn("⚠️ AUTH: No token found for whoami");
      throw new Error("No authentication token");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ AUTH: Whoami failed", {
          status: response.status,
          errorData,
        });
        throw new Error(
          errorData.message || `Whoami failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ AUTH: Whoami successful", {
        userId: data.id,
        role: data.role,
      });
      return data;
    } catch (error) {
      console.error("💥 AUTH: Whoami network error", error);
      throw error;
    }
  },

  logout() {
    console.log("🚪 AUTH: Logout");
    localStorage.removeItem("auth_token");
  },

  getToken(): string | null {
    const token = localStorage.getItem("auth_token");
    console.log("🔑 AUTH: Get token", { hasToken: !!token });
    return token;
  },

  setToken(token: string) {
    console.log("🔑 AUTH: Set token", { tokenLength: token.length });
    localStorage.setItem("auth_token", token);
  },
};

// Service des élections avec fetch séparés pour debug
export const electionService = {
  async getAll(): Promise<Election[]> {
    console.log("🗳️ ELECTION: Get all elections");
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${API_BASE_URL}/elections`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ ELECTION: Get all failed", {
          status: response.status,
          errorData,
        });
        throw new Error(
          errorData.message || `Get elections failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ ELECTION: Get all successful", { count: data.length });
      return data;
    } catch (error) {
      console.error("💥 ELECTION: Get all network error", error);
      throw error;
    }
  },

  async create(electionData: CreateElection): Promise<Election> {
    console.log("➕ ELECTION: Create election", { title: electionData.title });
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${API_BASE_URL}/elections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify([electionData]), // L'API attend un tableau
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ ELECTION: Create failed", {
          status: response.status,
          errorData,
        });
        throw new Error(
          errorData.message || `Create election failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ ELECTION: Create successful", {
        electionId: data[0]?.id,
      });
      return data[0]; // L'API retourne un tableau
    } catch (error) {
      console.error("💥 ELECTION: Create network error", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Election> {
    console.log("🔍 ELECTION: Get by ID", { electionId: id });
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${API_BASE_URL}/elections/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ ELECTION: Get by ID failed", {
          status: response.status,
          errorData,
          electionId: id,
        });
        throw new Error(
          errorData.message || `Get election failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ ELECTION: Get by ID successful", { electionId: data.id });
      return data;
    } catch (error) {
      console.error("💥 ELECTION: Get by ID network error", error);
      throw error;
    }
  },

  async getResult(electionId: string): Promise<ElectionResult> {
    console.log("📊 ELECTION: Get result", { electionId });
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/elections/${electionId}/result`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ ELECTION: Get result failed", {
          status: response.status,
          errorData,
          electionId,
        });
        throw new Error(
          errorData.message || `Get election result failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ ELECTION: Get result successful", {
        electionId: data.electionId,
        totalVotes: data.totalVote,
      });
      return data;
    } catch (error) {
      console.error("💥 ELECTION: Get result network error", error);
      throw error;
    }
  },
};

// Service des citoyens avec fetch séparés pour debug
export const citizenService = {
  async getAll(gid?: string, id?: string): Promise<Citizen[]> {
    console.log("👥 CITIZEN: Get all citizens", { gid, id });
    const token = localStorage.getItem("auth_token");

    const params = new URLSearchParams();
    if (gid) params.append("gid", gid);
    if (id) params.append("id", id);
    const query = params.toString();
    const url = `${API_BASE_URL}/citizens${query ? `?${query}` : ""}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ CITIZEN: Get all failed", {
          status: response.status,
          errorData,
          params: { gid, id },
        });
        throw new Error(
          errorData.message || `Get citizens failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ CITIZEN: Get all successful", { count: data.length });
      return data;
    } catch (error) {
      console.error("💥 CITIZEN: Get all network error", error);
      throw error;
    }
  },

  async create(citizenData: CreateCitizen): Promise<Citizen> {
    console.log("➕ CITIZEN: Create citizen", {
      gid: citizenData.gid,
      firstName: citizenData.firstName,
    });
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${API_BASE_URL}/citizens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify([citizenData]), // L'API attend un tableau
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ CITIZEN: Create failed", {
          status: response.status,
          errorData,
        });
        throw new Error(
          errorData.message || `Create citizen failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ CITIZEN: Create successful", { citizenId: data[0]?.id });
      return data[0]; // L'API retourne un tableau
    } catch (error) {
      console.error("💥 CITIZEN: Create network error", error);
      throw error;
    }
  },

  async update(citizenData: UpdateCitizen): Promise<Citizen> {
    console.log("✏️ CITIZEN: Update citizen", {
      id: citizenData.id,
      firstName: citizenData.firstName,
    });
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${API_BASE_URL}/citizens`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify([citizenData]), // L'API attend un tableau
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ CITIZEN: Update failed", {
          status: response.status,
          errorData,
        });
        throw new Error(
          errorData.message || `Update citizen failed: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ CITIZEN: Update successful", { citizenId: data[0]?.id });
      return data[0]; // L'API retourne un tableau
    } catch (error) {
      console.error("💥 CITIZEN: Update network error", error);
      throw error;
    }
  },
};

// Service des votes avec fetch séparés pour debug
export const voteService = {
  async create(voteData: CreateVote): Promise<void> {
    console.log("🗳️ VOTE: Create vote", {
      electionId: voteData.electionId,
      candidateId: voteData.candidateId,
    });
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${API_BASE_URL}/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify([voteData]), // L'API attend un tableau
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        console.error("❌ VOTE: Create failed", {
          status: response.status,
          errorData,
        });
        throw new Error(
          errorData.message || `Create vote failed: ${response.status}`,
        );
      }

      console.log("✅ VOTE: Create successful");
      return; // No response body expected
    } catch (error) {
      console.error("💥 VOTE: Create network error", error);
      throw error;
    }
  },
};

// Export par défaut pour compatibilité
const apiServices = {
  auth: authService,
  election: electionService,
  citizen: citizenService,
  vote: voteService,
};

export default apiServices;
