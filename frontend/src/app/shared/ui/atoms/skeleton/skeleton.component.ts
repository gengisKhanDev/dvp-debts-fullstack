import { Component, Input } from '@angular/core';

@Component({
	selector: 'ui-skeleton',
	standalone: true,
	template: `
    <span
      class="block animate-pulse rounded-xl bg-white/10"
      [style.width.px]="width"
      [style.height.px]="height"
      aria-hidden="true"
    ></span>
  `,
})
export class SkeletonComponent {
	@Input() width = 120;
	@Input() height = 14;
}
