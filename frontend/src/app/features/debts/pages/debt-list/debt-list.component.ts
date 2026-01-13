import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subject, catchError, finalize, map, of, startWith, switchMap, take } from 'rxjs';

import { DebtsApiService } from '../../data-access/debts-api.service';
import type { Debt, DebtStatus, DebtSummary } from '../../models/debt.models';

import { SkeletonComponent } from '../../../../shared/ui/atoms/skeleton/skeleton.component';
import { CardComponent } from '../../../../shared/ui/atoms/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button.component';
import { BadgeComponent } from '../../../../shared/ui/atoms/badge/badge.component';
import { AlertComponent } from '../../../../shared/ui/atoms/alert/alert.component';
import { PageHeaderComponent } from '../../../../shared/ui/molecules/page-header/page-header.component';

type Vm =
	| { loading: true; status: DebtStatus; debts: Debt[]; error: null }
	| { loading: false; status: DebtStatus; debts: Debt[]; error: string | null };

type SummaryVm =
	| { loading: true; summary: null; error: null }
	| { loading: false; summary: DebtSummary | null; error: string | null };

@Component({
	selector: 'app-debt-list',
	imports: [
		AsyncPipe,
		RouterLink,
		SkeletonComponent,
		CardComponent,
		ButtonComponent,
		BadgeComponent,
		AlertComponent,
		PageHeaderComponent,
	],
	templateUrl: './debt-list.component.html',
})
export class DebtListComponent {
	private readonly status$ = new BehaviorSubject<DebtStatus>('PENDING');
	private readonly refresh$ = new Subject<void>();

	exportLoading = false;
	exportError: string | null = null;

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

	vm$ = this.status$.pipe(
		switchMap((status) =>
			this.api.list(status).pipe(
				map((debts) => ({ loading: false, status, debts, error: null } as Vm)),
				startWith({ loading: true, status, debts: [], error: null } as Vm),
				catchError(() => of({ loading: false, status, debts: [], error: 'No se pudo cargar' } as Vm)),
			),
		),
	);

	constructor(private readonly api: DebtsApiService) { }

	setStatus(status: DebtStatus) {
		this.status$.next(status);
	}

	reload() {
		this.refresh$.next();
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
		const match = /filename="([^"]+)"/i.exec(disposition);
		if (match?.[1]) return match[1];
		const matchStar = /filename\*\=UTF-8''([^;]+)/i.exec(disposition);
		if (matchStar?.[1]) return decodeURIComponent(matchStar[1]);
		return null;
	}
}
