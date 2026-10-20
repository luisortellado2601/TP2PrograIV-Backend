import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Get } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Get()
    getAll(): string{
        return this.usuariosService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: string): string {
        return this.usuariosService.getById(id);
    }

    @Post()
    create(@Body() createUsuarioDto: any): string {
        console.log(createUsuarioDto);
        return this.usuariosService.create(createUsuarioDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUsuarioDto: any): string {
        return this.usuariosService.update(id, updateUsuarioDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string): string {
        return this.usuariosService.delete(id);
    }
}
