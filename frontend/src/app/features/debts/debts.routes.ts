import { Routes } from '@angular/router';
import { DebtListComponent } from './pages/debt-list/debt-list.component';

export const DEBTS_ROUTES: Routes = [
	{ path: '', component: DebtListComponent, title: 'Mis deudas' },
];
