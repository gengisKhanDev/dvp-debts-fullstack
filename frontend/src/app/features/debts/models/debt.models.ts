export type DebtStatus = 'PENDING' | 'PAID';

export interface Debt {
  id: string;
  title?: string;
  description?: string;
  amount: number;
  status: DebtStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDebtRequest {
  creditorName: string;
  creditorEmail: string;
  creditorPhone: string;
  amount: number;
  description?: string;
}
