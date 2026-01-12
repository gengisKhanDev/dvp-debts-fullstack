import { Routes } from '@angular/router';
import { HomeComponent } from './shared/ui/templates/home/home.component'

export const routes: Routes = [
	{ path: '', component: HomeComponent, title: 'Home' },
	{ path: '**', redirectTo: '' },
];
