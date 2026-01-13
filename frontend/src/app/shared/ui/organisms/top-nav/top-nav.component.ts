import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SkeletonComponent } from '../../atoms/skeleton/skeleton.component';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
	selector: 'ui-top-nav',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, SkeletonComponent, ButtonComponent],
	templateUrl: './top-nav.component.html',
})
export class TopNavComponent {
	@Input() loading = false;
	@Input() email: string | null = null;

	@Output() logout = new EventEmitter<void>();

	onLogout(): void {
		this.logout.emit();
	}
}
