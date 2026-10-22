import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeError(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const mensaje = error.error?.message;
    if (Array.isArray(mensaje)) {
      return mensaje.join('. ');
    }
    if (typeof mensaje === 'string') {
      return mensaje;
    }
  }
  return fallback;
}
