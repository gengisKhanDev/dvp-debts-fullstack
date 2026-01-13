import { Component, Input } from '@angular/core';

type CardPadding = 'sm' | 'md' | 'lg';

@Component({
	selector: 'ui-card',
	standalone: true,
	templateUrl: './card.component.html',
})
export class CardComponent {
	@Input() padding: CardPadding = 'md';
	@Input() extraClass = '';

	get classes(): string {
		const base = 'rounded-2xl border border-white/10 bg-white/5 shadow-sm';
		const pad: Record<CardPadding, string> = {
			sm: 'p-4',
			md: 'p-6',
			lg: 'p-8',
		};
		return [base, pad[this.padding], this.extraClass].filter(Boolean).join(' ');
	}
}
