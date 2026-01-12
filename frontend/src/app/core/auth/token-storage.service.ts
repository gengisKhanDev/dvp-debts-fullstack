import { Injectable } from '@angular/core';

const KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
	get(): string | null {
		return localStorage.getItem(KEY);
	}

	set(token: string): void {
		localStorage.setItem(KEY, token);
	}

	clear(): void {
		localStorage.removeItem(KEY);
	}
}
