import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';

import { AuthApiService } from '../../data-access/auth-api.service';
import { TokenStorageService } from '../../../../core/auth/token-storage.service';

@Component({
	selector: 'app-register',
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './register.component.html',
})
export class RegisterComponent {
	private readonly fb = inject(FormBuilder);
	private readonly api = inject(AuthApiService);
	private readonly tokens = inject(TokenStorageService);
	private readonly router = inject(Router);

	loading = false;
	error: string | null = null;

	form = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const body = this.form.getRawValue();
		this.loading = true;
		this.error = null;

		this.api.register(body).pipe(
			switchMap(() => this.api.login(body)), // auto-login
			finalize(() => (this.loading = false)),
		).subscribe({
			next: (res) => {
				this.tokens.set(res.accessToken);
				this.router.navigateByUrl('/debts');
			},
			error: (err) => {
				this.error = err?.error?.message ?? 'No se pudo registrar';
			},
		});
	}
}
