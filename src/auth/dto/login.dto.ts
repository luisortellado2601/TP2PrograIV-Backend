import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Debe indicar el usuario o correo' })
  @MinLength(1, { message: 'Debe indicar el usuario o correo' })
  usuarioOCorreo: string;

  @IsString({ message: 'Debe indicar la contraseña' })
  @MinLength(1, { message: 'Debe indicar la contraseña' })
  contrasena: string;
}
