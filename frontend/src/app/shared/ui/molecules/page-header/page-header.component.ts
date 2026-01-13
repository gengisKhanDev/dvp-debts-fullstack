import { Component, Input } from '@angular/core';

@Component({
	selector: 'ui-page-header',
	standalone: true,
	templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
	@Input({ required: true }) title!: string;
	@Input() subtitle?: string;
}
