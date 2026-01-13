import { Component, Input } from '@angular/core';

@Component({
	selector: 'ui-form-field',
	standalone: true,
	templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
	@Input() label = '';
	@Input() hint: string | null = null;
	@Input() error: string | null = null;
	@Input() required = false;
}
