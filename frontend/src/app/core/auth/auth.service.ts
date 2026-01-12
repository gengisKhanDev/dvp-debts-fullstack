import { Injectable, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import { AuthApiService } from '../../features/auth/data-access/auth-api.service';
import type { MeResponse } from '../../features/auth/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
	user = signal<MeResponse | null>(null);
	ready = signal(false);

	constructor(
		private readonly tokens: TokenStorageService,
		private readonly api: AuthApiService,
	) { }

	isLoggedIn(): boolean {
		return !!this.tokens.get();
	}

	logout(): void {
		this.tokens.clear();
		this.user.set(null);
	}

	initSession() {
		const token = this.tokens.get();

		if (!token) {
			this.ready.set(true);
			return of(null);
		}

		return this.api.me().pipe(
			tap((me) => this.user.set(me)),
			catchError(() => {
				this.logout();
				return of(null);
			}),
			finalize(() => this.ready.set(true)),
		);
	}
}
