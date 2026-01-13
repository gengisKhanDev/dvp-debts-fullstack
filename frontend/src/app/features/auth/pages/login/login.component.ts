import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthApiService } from '../../data-access/auth-api.service';
import { TokenStorageService } from '../../../../core/auth/token-storage.service';
import { CardComponent } from '../../../../shared/ui/atoms/card/card.component';
import { AlertComponent } from '../../../../shared/ui/atoms/alert/alert.component';
import { InputComponent } from '../../../../shared/ui/atoms/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button.component';
import { FormFieldComponent } from '../../../../shared/ui/molecules/form-field/form-field.component';

@Component({
	selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CardComponent, AlertComponent, InputComponent, ButtonComponent, FormFieldComponent],
	templateUrl: './login.component.html',
})
export class LoginComponent {
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

		this.loading = true;
		this.error = null;

		this.api.login(this.form.getRawValue())
			.pipe(finalize(() => (this.loading = false)))
			.subscribe({
				next: (res) => {
					this.tokens.set(res.accessToken);
					this.router.navigateByUrl('/debts');
				},
				error: (err) => {
					this.error = err?.error?.message ?? 'No se pudo iniciar sesión';
				},
			});
	}
}
