// Types pour l'API Madagascar Voting System

export interface LoginRequest {
  gid: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface CreateCitizen {
  firstName: string;
  lastName: string;
  gid: string;
  password: string;
}

export interface UpdateCitizen {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface Citizen extends CreateCitizen {
  id: string;
}

export interface ElectionCandidate {
  gid: string;
  description: string;
}

export interface CreateElection {
  title: string;
  startAt: string; // ISO date-time
  endAt: string;   // ISO date-time
  candidates: ElectionCandidate[];
}

export interface Election extends CreateElection {
  id: string;
  createdAt: string; // ISO date-time
}

export interface ElectionCandidateResult {
  candidateGid: string;
  voteAmount: number;
}

export interface ElectionResult {
  electionId: string;
  totalVote: number;
  candidateResults: ElectionCandidateResult[];
}

export interface CreateVote {
  electionId: string;
  candidateId: string;
}

export interface BiometricData {
  type: BiometricDataType;
  embedding: number[];
}

export type BiometricDataType = 'FACE_ID';

// API Response wrappers
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
