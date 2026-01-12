import { Routes } from '@angular/router';
import { ShellComponent } from './shared/ui/templates/shell/shell.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'debts' },

	{
		path: '',
		component: ShellComponent,
		children: [
			{
				path: 'debts',
				canActivate: [authGuard],
				loadChildren: () =>
					import('./features/debts/debts.routes').then((m) => m.DEBTS_ROUTES),
			},
		],
	},

	{
		path: 'auth',
		loadChildren: () =>
			import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
	},

	{ path: '**', redirectTo: 'debts' },
];
