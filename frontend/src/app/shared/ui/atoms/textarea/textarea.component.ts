import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ui-textarea',
	standalone: true,
	templateUrl: './textarea.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TextareaComponent),
			multi: true,
		},
	],
})
export class TextareaComponent implements ControlValueAccessor {
	@Input() rows = 3;
	@Input() placeholder = '';

	disabled = false;
	value = '';

	private onChange: (value: any) => void = () => { };
	private onTouched: () => void = () => { };

	writeValue(v: any): void {
		this.value = v === null || v === undefined ? '' : String(v);
	}
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	handleInput(ev: Event) {
		const raw = (ev.target as HTMLTextAreaElement).value;
		this.value = raw;
		this.onChange(raw);
	}

	handleBlur() {
		this.onTouched();
	}

	get classes(): string {
		return (
			'w-full rounded-xl border border-white/10 bg-transparent p-2 outline-none ' +
			'transition focus:ring-2 focus:ring-white/25 disabled:opacity-50'
		);
	}
}
