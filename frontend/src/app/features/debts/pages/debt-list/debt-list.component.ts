import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
	BehaviorSubject, catchError, distinctUntilChanged, map, of, startWith, switchMap
} from 'rxjs';

import { DebtsApiService } from '../../data-access/debts-api.service';
import type { Debt, DebtStatus } from '../../models/debt.models';
import { SkeletonComponent } from '../../../../shared/ui/atoms/skeleton/skeleton.component';
import { RouterLink } from '@angular/router';

type Vm =
	| { loading: true; status: DebtStatus; debts: Debt[]; error: null }
	| { loading: false; status: DebtStatus; debts: Debt[]; error: string | null };

@Component({
	selector: 'app-debt-list',
	imports: [AsyncPipe, SkeletonComponent, RouterLink],
	templateUrl: './debt-list.component.html',
})
export class DebtListComponent {
	private readonly status$ = new BehaviorSubject<DebtStatus>('PENDING');

	vm$ = this.status$.pipe(
		distinctUntilChanged(),
		switchMap((status) =>
			this.api.list(status).pipe(
				map((debts) => ({ loading: false, status, debts, error: null } as Vm)),
				startWith({ loading: true, status, debts: [], error: null } as Vm),
				catchError((err) =>
					of({
						loading: false,
						status,
						debts: [],
						error: err?.error?.message ?? 'No se pudo cargar',
					} as Vm),
				),
			),
		),
	);

	constructor(private readonly api: DebtsApiService) { }

	setStatus(status: DebtStatus) {
		if (this.status$.getValue() === status) return;
		this.status$.next(status);
	}
}
