import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

@Injectable()
export class PasswordHasher {
  hash(contrasena: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivada = scryptSync(contrasena, salt, KEY_LENGTH).toString('hex');
    return `${salt}:${derivada}`;
  }

  verify(contrasena: string, hashAlmacenado: string): boolean {
    const [salt, derivadaHex] = hashAlmacenado.split(':');
    if (!salt || !derivadaHex) {
      return false;
    }

    const derivadaEsperada = Buffer.from(derivadaHex, 'hex');
    const derivadaCalculada = scryptSync(contrasena, salt, KEY_LENGTH);
    if (derivadaEsperada.length !== derivadaCalculada.length) {
      return false;
    }

    return timingSafeEqual(derivadaEsperada, derivadaCalculada);
  }
}
