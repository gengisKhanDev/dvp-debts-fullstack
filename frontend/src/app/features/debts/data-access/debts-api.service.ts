import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/http/api-base-url.token';
import type { Debt, DebtStatus } from '../models/debt.models';

@Injectable({ providedIn: 'root' })
export class DebtsApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = inject(API_BASE_URL);

	list(status?: DebtStatus) {
		let params = new HttpParams();
		if (status) params = params.set('status', status);
		return this.http.get<Debt[]>(`${this.baseUrl}/debts`, { params });
	}
}
