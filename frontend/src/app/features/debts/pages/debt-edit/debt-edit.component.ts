import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
	catchError,
	distinctUntilChanged,
	filter,
	finalize,
	map,
	of,
	startWith,
	switchMap,
	tap,
} from 'rxjs';

import { DebtsApiService } from '../../data-access/debts-api.service';
import type { Debt, UpdateDebtRequest } from '../../models/debt.models';
import { SkeletonComponent } from '../../../../shared/ui/atoms/skeleton/skeleton.component';

type Vm =
	| { loading: true; id: string; debt: null; error: null }
	| { loading: false; id: string; debt: Debt | null; error: string | null };

@Component({
	selector: 'app-debt-edit',
	imports: [AsyncPipe, RouterLink, ReactiveFormsModule, SkeletonComponent],
	templateUrl: './debt-edit.component.html',
})
export class DebtEditComponent {
	private readonly api = inject(DebtsApiService);
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly fb = inject(FormBuilder).nonNullable;

	saving = false;
	saveError: string | null = null;

	private filledForId: string | null = null;

	form = this.fb.group({
		creditorName: ['', [Validators.required]],
		creditorEmail: ['', [Validators.required, Validators.email]],
		creditorPhone: ['', [Validators.required]],
		amount: [0, [Validators.required, Validators.min(0.01)]],
		description: [''],
	});

	private readonly id$ = this.route.paramMap.pipe(
		map((pm) => pm.get('id')),
		filter((id): id is string => !!id),
		distinctUntilChanged(),
	);

	vm$ = this.id$.pipe(
		switchMap((id) =>
			this.api.get(id).pipe(
				// ✅ Prefill SOLO 1 vez por id (para no pisar lo que el usuario edita)
				tap((debt) => {
					if (this.filledForId === id) return;
					this.filledForId = id;

					this.form.patchValue({
						creditorName: debt.creditorName ?? '',
						creditorEmail: debt.creditorEmail ?? '',
						creditorPhone: debt.creditorPhone ?? '',
						amount: debt.amount,
						description: debt.description ?? '',
					});
				}),
				map((debt) => ({ loading: false, id, debt, error: null } as Vm)),
				startWith({ loading: true, id, debt: null, error: null } as Vm),
				catchError((err) =>
					of({
						loading: false,
						id,
						debt: null,
						error: err?.error?.message ?? 'No se pudo cargar la deuda',
					} as Vm),
				),
			),
		),
	);

	submit(id: string, debt: Debt) {
		if (debt.status === 'PAID') return;

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.saving = true;
		this.saveError = null;

		const body: UpdateDebtRequest = this.form.getRawValue();

		this.api
			.update(id, body)
			.pipe(finalize(() => (this.saving = false)))
			.subscribe({
				next: () => this.router.navigate(['/debts', id]),
				error: (err) => {
					const msg = err?.error?.message;
					this.saveError =
						msg === 'PaidDebtCannotBeModified'
							? 'Esta deuda ya está pagada y no se puede modificar.'
							: (msg ?? 'No se pudo actualizar la deuda');
				},
			});
	}
}
