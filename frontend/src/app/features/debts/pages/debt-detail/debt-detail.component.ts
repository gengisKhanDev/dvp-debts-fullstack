import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

type Vm =
	| { loading: true; id: string; debt: null; error: null }
	| { loading: false; id: string; debt: Debt | null; error: string | null };

@Component({
	selector: 'app-debt-detail',
	imports: [AsyncPipe, RouterLink, SkeletonComponent],
	templateUrl: './debt-detail.component.html',
})
export class DebtDetailComponent {
	// ✅ primero inyecta (así no dependes del constructor)
	private readonly api = inject(DebtsApiService);
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);

	private readonly refresh$ = new Subject<void>();

	action: 'pay' | 'delete' | null = null;
	actionError: string | null = null;

	// ✅ ahora sí puedes usar route sin “used before init”
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
