import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  onLogout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
