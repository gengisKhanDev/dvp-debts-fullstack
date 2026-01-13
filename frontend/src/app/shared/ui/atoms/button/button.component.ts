import { Component, Input } from '@angular/core';

type ButtonVariant = 'soft' | 'primary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
	selector: 'ui-button',
	standalone: true,
	templateUrl: './button.component.html',
	host: { class: 'contents' },
})
export class ButtonComponent {
	@Input() variant: ButtonVariant = 'soft';
	@Input() size: ButtonSize = 'md';
	@Input() type: 'button' | 'submit' = 'button';
	@Input() disabled = false;
	@Input() extraClass = '';

	get classes(): string {
		const base =
			'inline-flex items-center justify-center gap-2 rounded-xl font-medium ' +
			'transition focus:outline-none focus:ring-2 focus:ring-white/25 ' +
			'disabled:opacity-50 disabled:pointer-events-none';

		const sizes: Record<ButtonSize, string> = {
			sm: 'px-3 py-1 text-sm',
			md: 'px-4 py-2 text-sm',
			lg: 'px-5 py-3 text-base',
		};

		const variants: Record<ButtonVariant, string> = {
			soft: 'border border-white/10 bg-white/10 hover:bg-white/15',
			primary: 'bg-white text-black hover:bg-white/90',
			danger: 'border border-red-500/30 bg-red-500/10 text-red-100 hover:bg-red-500/15',
			ghost: 'border border-white/10 bg-transparent hover:bg-white/5',
		};

		return [base, sizes[this.size], variants[this.variant], this.extraClass]
			.filter(Boolean)
			.join(' ');
	}
}
