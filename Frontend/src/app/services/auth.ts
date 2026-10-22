import { Service, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginPayload, RegistroPayload, SesionResponse, Usuario } from '../models/usuario';

const CLAVE_SESION = 'nextplay_sesion';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sesion = signal<SesionResponse | null>(this.leerSesionGuardada());

  readonly usuarioActual = computed<Usuario | null>(() => this.sesion()?.usuario ?? null);
  readonly estaAutenticado = computed<boolean>(() => this.sesion() !== null);

  registro(payload: RegistroPayload): Observable<SesionResponse> {
    return this.http
      .post<SesionResponse>(`${environment.apiUrl}/auth/registro`, payload)
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  login(payload: LoginPayload): Observable<SesionResponse> {
    return this.http
      .post<SesionResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  logout(): void {
    this.sesion.set(null);
    localStorage.removeItem(CLAVE_SESION);
  }

  obtenerToken(): string | null {
    return this.sesion()?.token ?? null;
  }

  private guardarSesion(respuesta: SesionResponse): void {
    this.sesion.set(respuesta);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(respuesta));
  }

  private leerSesionGuardada(): SesionResponse | null {
    const guardada = localStorage.getItem(CLAVE_SESION);
    if (!guardada) {
      return null;
    }
    try {
      return JSON.parse(guardada) as SesionResponse;
    } catch {
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
  }
}
