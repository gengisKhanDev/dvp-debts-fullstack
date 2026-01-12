import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/http/api-base-url.token';
import type { Debt, DebtStatus, CreateDebtRequest } from '../models/debt.models';

@Injectable({ providedIn: 'root' })
export class DebtsApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = inject(API_BASE_URL);

	list(status?: DebtStatus) {
		let params = new HttpParams();
		if (status) params = params.set('status', status);
		return this.http.get<Debt[]>(`${this.baseUrl}/debts`, { params });
	}

	get(id: string) {
		return this.http.get<Debt>(`${this.baseUrl}/debts/${id}`);
	}

	pay(id: string) {
		return this.http.post<void>(`${this.baseUrl}/debts/${id}/pay`, {});
	}

	remove(id: string) {
		return this.http.delete<void>(`${this.baseUrl}/debts/${id}`);
	}

	create(body: CreateDebtRequest) {
		return this.http.post<void>(`${this.baseUrl}/debts`, body);
	}
}
