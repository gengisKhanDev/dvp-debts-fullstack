import { Component, Input } from '@angular/core';

type AlertTone = 'info' | 'danger' | 'success' | 'warning';

@Component({
	selector: 'ui-alert',
	standalone: true,
	templateUrl: './alert.component.html',
})
export class AlertComponent {
	@Input() tone: AlertTone = 'info';
	@Input() title: string | null = null;
	@Input() message: string | null = null;

	get boxClass(): string {
		const base = 'rounded-2xl border p-4 text-sm';
		const tones: Record<AlertTone, string> = {
			info: 'border-white/10 bg-white/5 text-white/90',
			success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
			warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-100',
			danger: 'border-red-500/30 bg-red-500/10 text-red-100',
		};
		return `${base} ${tones[this.tone]}`;
	}
}
