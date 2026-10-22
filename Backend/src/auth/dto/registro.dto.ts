import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PerfilUsuario } from '../../usuarios/usuario.schema';

export class RegistroDto {
  @IsString({ message: 'El nombre es obligatorio' })
  @MinLength(1, { message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString({ message: 'El apellido es obligatorio' })
  @MinLength(1, { message: 'El apellido es obligatorio' })
  apellido: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  correo: string;

  @IsString()
  @MinLength(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  })
  nombreUsuario: string;

  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
  })
  contrasena: string;

  @IsString()
  repetirContrasena: string;

  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  fechaNacimiento: string;

  @IsOptional()
  @IsString()
  @MaxLength(280, {
    message: 'La descripción no puede superar los 280 caracteres',
  })
  descripcion?: string;

  @IsOptional()
  @IsEnum(PerfilUsuario, {
    message: 'El perfil debe ser usuario o administrador',
  })
  perfil?: PerfilUsuario;
}
