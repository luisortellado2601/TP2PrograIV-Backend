import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ModalService } from '../../services/modal';
import { mensajeDeError } from '../../utils/mensaje-error';
import { PerfilUsuario } from '../../models/usuario';
import { contrasenasIgualesValidator } from './contrasenas-iguales-validator';
import { sinSoloEspaciosValidator } from '../../utils/sin-espacios-validator';

const PATRON_CONTRASENA = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly perfiles = [PerfilUsuario.USUARIO, PerfilUsuario.ADMINISTRADOR];

  protected readonly form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, sinSoloEspaciosValidator()]],
      apellido: ['', [Validators.required, sinSoloEspaciosValidator()]],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: [
        '',
        [Validators.required, Validators.minLength(3), sinSoloEspaciosValidator()],
      ],
      contrasena: ['', [Validators.required, Validators.pattern(PATRON_CONTRASENA)]],
      repetirContrasena: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcion: ['', [Validators.maxLength(280)]],
      perfil: [PerfilUsuario.USUARIO, [Validators.required]],
    },
    { validators: [contrasenasIgualesValidator('contrasena', 'repetirContrasena')] },
  );

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    const payload = this.form.getRawValue();
    payload.nombre = payload.nombre.trim();
    payload.apellido = payload.apellido.trim();
    payload.nombreUsuario = payload.nombreUsuario.trim();

    this.authService.registro(payload).subscribe({
      next: () => {
        this.enviando.set(false);
        this.modalService.exito('¡Cuenta creada con éxito! Ya iniciaste sesión.');
        this.router.navigateByUrl('/publicaciones');
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.modalService.error(
          mensajeDeError(error, 'No pudimos crear tu cuenta. Intentá nuevamente.'),
        );
      },
    });
  }
}
