import { Routes } from '@angular/router';
import { DebtListComponent } from './pages/debt-list/debt-list.component';
import { DebtCreateComponent } from './pages/debt-create/debt-create.component';
import { DebtDetailComponent } from './pages/debt-detail/debt-detail.component';

export const DEBTS_ROUTES: Routes = [
	{ path: '', component: DebtListComponent, title: 'Mis deudas' },

	// ✅ antes de ':id'
	{ path: 'new', component: DebtCreateComponent, title: 'Crear deuda' },

	{ path: ':id', component: DebtDetailComponent, title: 'Detalle deuda' },
];
