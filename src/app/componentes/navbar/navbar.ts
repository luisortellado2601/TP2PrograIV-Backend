import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ModalService } from '../../services/modal';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.modalService.confirmar('¿Querés cerrar tu sesión?', () => {
      this.authService.logout();
      this.router.navigateByUrl('/login');
    });
  }
}
