import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Subject, catchError, finalize, map, of, startWith, switchMap, take } from 'rxjs';
import { RouterLink } from '@angular/router';

import { DebtsApiService } from '../../data-access/debts-api.service';
import type { Debt, DebtStatus, DebtSummary } from '../../models/debt.models';
import { SkeletonComponent } from '../../../../shared/ui/atoms/skeleton/skeleton.component';

type Vm =
	| { loading: true; status: DebtStatus; debts: Debt[]; error: null }
	| { loading: false; status: DebtStatus; debts: Debt[]; error: string | null };

type SummaryVm =
	| { loading: true; summary: null; error: null }
	| { loading: false; summary: DebtSummary | null; error: string | null };

@Component({
	selector: 'app-debt-list',
	imports: [AsyncPipe, SkeletonComponent, RouterLink],
	templateUrl: './debt-list.component.html',
})
export class DebtListComponent {
	private readonly status$ = new BehaviorSubject<DebtStatus>('PENDING');
	private readonly refresh$ = new Subject<void>();

	exportLoading = false;
	exportError: string | null = null;

	// ✅ Summary: se carga al entrar y también cuando llamas reload()
	summaryVm$ = this.refresh$.pipe(
		startWith(void 0),
		switchMap(() =>
			this.api.summary().pipe(
				map((summary) => ({ loading: false, summary, error: null } as SummaryVm)),
				startWith({ loading: true, summary: null, error: null } as SummaryVm),
				catchError((err) =>
					of({
						loading: false,
						summary: null,
						error: err?.error?.message ?? 'No se pudo cargar el summary',
					} as SummaryVm),
				),
			),
		),
	);

	// ✅ Listado: como lo tienes
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

	reload() {
		this.refresh$.next();
		// el listado se recarga solo cuando cambia status; si quieres recargarlo también,
		// simplemente re-emite el mismo valor:
		this.status$.next(this.status$.getValue());
	}

	export(format: 'csv' | 'json') {
		this.exportLoading = true;
		this.exportError = null;

		this.status$.pipe(take(1)).subscribe((status) => {
			this.api
				.exportFile(format, status)
				.pipe(finalize(() => (this.exportLoading = false)))
				.subscribe({
					next: (resp) => {
						const filename =
							this.getFilenameFromDisposition(resp.headers.get('content-disposition')) ??
							`debts-${status}-${new Date().toISOString().slice(0, 10)}.${format}`;

						this.downloadBlob(resp.body!, filename);
					},
					error: (err) => {
						this.exportError = err?.error?.message ?? 'No se pudo exportar';
					},
				});
		});
	}

	private downloadBlob(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	private getFilenameFromDisposition(disposition: string | null): string | null {
		if (!disposition) return null;

		// filename="..."
		const match = /filename="([^"]+)"/i.exec(disposition);
		if (match?.[1]) return match[1];

		// filename*=UTF-8''...
		const matchStar = /filename\*\=UTF-8''([^;]+)/i.exec(disposition);
		if (matchStar?.[1]) return decodeURIComponent(matchStar[1]);

		return null;
	}
}
