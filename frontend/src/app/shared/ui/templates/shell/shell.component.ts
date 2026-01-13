import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { TopNavComponent } from '../../organisms/top-nav/top-nav.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, TopNavComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  onLogout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
