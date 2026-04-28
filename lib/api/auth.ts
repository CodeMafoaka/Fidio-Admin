import {
  LoginRequest,
  AuthResponse,
  CreateCitizen,
  Citizen,
  ApiError,
} from "@/types/api";

// Export des types pour utilisation dans d'autres fichiers
export type { LoginRequest, AuthResponse, CreateCitizen, Citizen };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
        mode: "cors", // Explicit CORS mode
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
