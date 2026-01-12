import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from './core/http/auth.interceptor';
import { API_BASE_URL } from './core/http/api-base-url.token';
import { environment } from '../environments/environment';
import { AuthService } from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(withInterceptors([authInterceptor])),
		{ provide: API_BASE_URL, useValue: environment.apiBaseUrl },

		// ✅ corre al arrancar la app (recomendado)
		provideAppInitializer(() => {
			const auth = inject(AuthService);
			return firstValueFrom(auth.initSession());
		}),
	],
};
