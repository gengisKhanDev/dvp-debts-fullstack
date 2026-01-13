import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number';

@Component({
	selector: 'ui-input',
	standalone: true,
	templateUrl: './input.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputComponent),
			multi: true,
		},
	],
})
export class InputComponent implements ControlValueAccessor {
	@Input() type: InputType = 'text';
	@Input() placeholder = '';
	@Input() autocomplete: string | null = null;
	@Input() min: number | null = null;
	@Input() step: number | string | null = null;

	disabled = false;

	// guardamos string en el input; si type=number convertimos al propagar
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
		const raw = (ev.target as HTMLInputElement).value;
		this.value = raw;

		if (this.type === 'number') {
			// si queda vacío -> NaN (para que Validators lo marque inválido si aplica)
			this.onChange(raw === '' ? Number.NaN : Number(raw));
			return;
		}

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
