import { CreateVote, ApiError } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
