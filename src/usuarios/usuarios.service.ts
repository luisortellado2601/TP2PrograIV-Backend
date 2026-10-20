import { Injectable } from '@nestjs/common';

@Injectable()
export class UsuariosService {
    constructor() {
        console.log('UsuariosService initialized');
    }

    getAll() {
        return 'Todos los usuarios';
    }

    getById(id: string): string {
        return `Usuario con ID: ${id}`;
    }

    create(createUsuarioDto: any): string {
        return 'Usuario creado';
    }

    update(id: string, updateUsuarioDto: any): string {
        return `Usuario con ID: ${id} actualizado`;
    }

    delete(id: string): string {
        return `Usuario con ID: ${id} eliminado`;
    }
}
