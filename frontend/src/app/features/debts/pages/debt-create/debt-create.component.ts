import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { DebtsApiService } from '../../data-access/debts-api.service';

import { CardComponent } from '../../../../shared/ui/atoms/card/card.component';
import { AlertComponent } from '../../../../shared/ui/atoms/alert/alert.component';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button.component';
import { InputComponent } from '../../../../shared/ui/atoms/input/input.component';
import { TextareaComponent } from '../../../../shared/ui/atoms/textarea/textarea.component';
import { FormFieldComponent } from '../../../../shared/ui/molecules/form-field/form-field.component';
import { PageHeaderComponent } from '../../../../shared/ui/molecules/page-header/page-header.component';

@Component({
	selector: 'app-debt-create',
	imports: [
		ReactiveFormsModule,
		CardComponent,
		AlertComponent,
		ButtonComponent,
		InputComponent,
		TextareaComponent,
		FormFieldComponent,
		PageHeaderComponent,
	],
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

	back(): void {
		this.router.navigateByUrl('/debts');
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.loading = true;
		this.error = null;

		this.api
			.create(this.form.getRawValue())
			.pipe(finalize(() => (this.loading = false)))
			.subscribe({
				next: () => this.router.navigateByUrl('/debts'),
				error: (err) => {
					this.error = err?.error?.message ?? 'No se pudo crear la deuda';
				},
			});
	}
}
