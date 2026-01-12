import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { DebtsApiService } from '../../data-access/debts-api.service';

@Component({
	selector: 'app-debt-create',
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './debt-create.component.html',
})
export class DebtCreateComponent {
	private readonly fb = inject(FormBuilder).nonNullable;
	private readonly api = inject(DebtsApiService);
	private readonly router = inject(Router);

	loading = false;
	error: string | null = null;

	form = this.fb.group({
		creditorName: ['', [Validators.required]],
		creditorEmail: ['', [Validators.required, Validators.email]],
		creditorPhone: ['', [Validators.required]],
		amount: [0, [Validators.required, Validators.min(0.01)]],
		description: [''],
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.loading = true;
		this.error = null;

		this.api.create(this.form.getRawValue())
			.pipe(finalize(() => (this.loading = false)))
			.subscribe({
				next: () => this.router.navigateByUrl('/debts'),
				error: (err) => {
					// backend: { statusCode, error, message }
					this.error = err?.error?.message ?? 'No se pudo crear la deuda';
				},
			});
	}
}
