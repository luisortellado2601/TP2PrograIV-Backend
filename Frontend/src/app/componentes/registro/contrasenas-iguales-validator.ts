import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function contrasenasIgualesValidator(
  claveContrasena: string,
  claveRepetir: string,
): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const contrasena = grupo.get(claveContrasena)?.value;
    const repetir = grupo.get(claveRepetir)?.value;

    if (!repetir) {
      return null;
    }

    return contrasena === repetir ? null : { contrasenasDistintas: true };
  };
}
