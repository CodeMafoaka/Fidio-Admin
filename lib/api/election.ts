import {
  CreateElection,
  Election,
  ElectionResult,
  ApiError,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Service des élections avec fetch séparés pour debug
export const electionService = {
  async getAll(): Promise<Election[]> {
    console.log("🗳️ ELECTION: Get all elections");
    const token = localStorage.getItem("token");

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
    const token = localStorage.getItem("token");

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
    const token = localStorage.getItem("token");

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
    const token = localStorage.getItem("token");

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
