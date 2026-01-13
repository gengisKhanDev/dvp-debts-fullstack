import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
	Subject,
	catchError,
	distinctUntilChanged,
	filter,
	finalize,
	map,
	of,
	startWith,
	switchMap,
	take,
} from 'rxjs';

import { DebtsApiService } from '../../data-access/debts-api.service';
import type { Debt } from '../../models/debt.models';

import { SkeletonComponent } from '../../../../shared/ui/atoms/skeleton/skeleton.component';
import { CardComponent } from '../../../../shared/ui/atoms/card/card.component';
import { AlertComponent } from '../../../../shared/ui/atoms/alert/alert.component';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button.component';
import { BadgeComponent } from '../../../../shared/ui/atoms/badge/badge.component';

type Vm =
	| { loading: true; id: string; debt: null; error: null }
	| { loading: false; id: string; debt: Debt | null; error: string | null };

@Component({
	selector: 'app-debt-detail',
	imports: [AsyncPipe, SkeletonComponent, CardComponent, AlertComponent, ButtonComponent, BadgeComponent],
	templateUrl: './debt-detail.component.html',
})
export class DebtDetailComponent {
	private readonly api = inject(DebtsApiService);
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);

	private readonly refresh$ = new Subject<void>();

	action: 'pay' | 'delete' | null = null;
	actionError: string | null = null;

	readonly id$ = this.route.paramMap.pipe(
		map((pm) => pm.get('id')),
		filter((id): id is string => !!id),
		distinctUntilChanged(),
	);

	readonly vm$ = this.id$.pipe(
		switchMap((id) =>
			this.refresh$.pipe(
				startWith(void 0),
				switchMap(() =>
					this.api.get(id).pipe(
						map((debt) => ({ loading: false, id, debt, error: null } as Vm)),
						startWith({ loading: true, id, debt: null, error: null } as Vm),
						catchError((err) =>
							of({
								loading: false,
								id,
								debt: null,
								error: err?.error?.message ?? 'No se pudo cargar el detalle',
							} as Vm),
						),
					),
				),
			),
		),
	);

	back(): void {
		this.router.navigateByUrl('/debts');
	}

	edit(id: string): void {
		this.router.navigate(['/debts', id, 'edit']);
	}

	reload(): void {
		this.refresh$.next();
	}

	pay(): void {
		if (this.action) return;

		this.action = 'pay';
		this.actionError = null;

		this.id$
			.pipe(
				take(1),
				switchMap((id) => this.api.pay(id)),
				finalize(() => (this.action = null)),
			)
			.subscribe({
				next: () => this.reload(),
				error: (err) => (this.actionError = err?.error?.message ?? 'No se pudo marcar como pagada'),
			});
	}

	remove(): void {
		if (this.action) return;

		const ok = confirm('¿Eliminar esta deuda?');
		if (!ok) return;

		this.action = 'delete';
		this.actionError = null;

		this.id$
			.pipe(
				take(1),
				switchMap((id) => this.api.remove(id)),
				finalize(() => (this.action = null)),
			)
			.subscribe({
				next: () => this.router.navigateByUrl('/debts'),
				error: (err) => (this.actionError = err?.error?.message ?? 'No se pudo eliminar'),
			});
	}
}
