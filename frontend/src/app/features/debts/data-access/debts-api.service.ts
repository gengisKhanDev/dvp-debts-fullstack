import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/http/api-base-url.token';

import type {
	Debt,
	DebtStatus,
	CreateDebtRequest,
	UpdateDebtRequest,
	DebtSummary,
	CreateDebtResponse,
} from '../models/debt.models';

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

	create(body: CreateDebtRequest) {
		// Swagger dice que retorna { id }, si luego confirmas que viene vacío lo ajustamos.
		return this.http.post<CreateDebtResponse>(`${this.baseUrl}/debts`, body);
	}

	update(id: string, body: UpdateDebtRequest) {
		// tu controller devuelve OkResponse, pero el front no lo necesita
		return this.http.patch<void>(`${this.baseUrl}/debts/${id}`, body);
	}

	pay(id: string) {
		return this.http.post<void>(`${this.baseUrl}/debts/${id}/pay`, {});
	}

	remove(id: string) {
		return this.http.delete<void>(`${this.baseUrl}/debts/${id}`);
	}

	summary() {
		return this.http.get<DebtSummary>(`${this.baseUrl}/debts/summary`);
	}

	exportFile(format: 'json' | 'csv', status?: DebtStatus) {
		let params = new HttpParams().set('format', format);
		if (status) params = params.set('status', status);

		return this.http.get(`${this.baseUrl}/debts/export`, {
			params,
			observe: 'response' as const,
			responseType: 'blob' as const,
		});
	}
}
