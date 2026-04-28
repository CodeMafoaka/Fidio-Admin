export type ElectionStatus = "draft" | "active" | "completed";

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  candidates: number;
  votesOpen: boolean;
  totalVotes?: number;
  createdAt: string;
}
