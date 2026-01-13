import { Component, Input } from '@angular/core';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

@Component({
	selector: 'ui-badge',
	standalone: true,
	templateUrl: './badge.component.html',
})
export class BadgeComponent {
	@Input() tone: BadgeTone = 'neutral';
	@Input() extraClass = '';

	get classes(): string {
		const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border';
		const tones: Record<BadgeTone, string> = {
			neutral: 'border-white/10 bg-white/5 text-white/80',
			success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
			warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-100',
			danger: 'border-red-500/30 bg-red-500/10 text-red-100',
		};
		return [base, tones[this.tone], this.extraClass].filter(Boolean).join(' ');
	}
}
