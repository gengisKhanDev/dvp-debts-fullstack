import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';

import { DebtsApiService } from '../../data-access/debts-api.service';
import type { Debt, DebtStatus } from '../../models/debt.models';
import { SkeletonComponent } from '../../../../shared/ui/atoms/skeleton/skeleton.component';

type Vm =
	| { loading: true; status: DebtStatus; debts: Debt[]; error: null }
	| { loading: false; status: DebtStatus; debts: Debt[]; error: string | null };

@Component({
	selector: 'app-debt-list',
	imports: [AsyncPipe, SkeletonComponent],
	templateUrl: './debt-list.component.html',
})
export class DebtListComponent {
	private readonly status$ = new BehaviorSubject<DebtStatus>('PENDING');

	vm$ = this.status$.pipe(
		switchMap((status) =>
			this.api.list(status).pipe(
				map((debts) => ({ loading: false, status, debts, error: null } as Vm)),
				startWith({ loading: true, status, debts: [], error: null } as Vm),
				catchError(() =>
					of({ loading: false, status, debts: [], error: 'No se pudo cargar' } as Vm),
				),
			),
		),
	);

	constructor(private readonly api: DebtsApiService) { }

	setStatus(status: DebtStatus) {
		this.status$.next(status);
	}
}
