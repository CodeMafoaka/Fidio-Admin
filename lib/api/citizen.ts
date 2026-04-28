import { CreateCitizen, UpdateCitizen, Citizen, ApiError } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
