import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/http/api-base-url.token';
import type {
	LoginRequest, LoginResponse,
	RegisterRequest, RegisterResponse,
	MeResponse
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = inject(API_BASE_URL);

	login(body: LoginRequest) {
		return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, body);
	}

	register(body: RegisterRequest) {
		return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, body);
	}

	me() {
		return this.http.get<MeResponse>(`${this.baseUrl}/auth/me`);
	}
}
