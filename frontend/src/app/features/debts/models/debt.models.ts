export type DebtStatus = 'PENDING' | 'PAID';

export interface Debt {
  id: string;

  creditorName: string;
  creditorEmail: string | null;
  creditorPhone: string | null;

  amount: number;           // (ej 12.5)
  description: string | null;

  status: DebtStatus;

  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

export interface DebtSummary {
  pendingCount: number;
  paidCount: number;
  totalCount: number;

  pendingTotal: number;
  paidTotal: number;
  overallTotal: number;

  pendingBalance: number;
}

export interface CreateDebtRequest {
  creditorName: string;
  creditorEmail?: string | null;
  creditorPhone?: string | null;
  amount: number;
  description?: string | null;
}

export interface UpdateDebtRequest {
  creditorName: string;
  creditorEmail?: string | null;
  creditorPhone?: string | null;
  amount: number;
  description?: string | null;
}

export interface CreateDebtResponse {
  id: string;
}
