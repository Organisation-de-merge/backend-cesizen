import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les rôles' })
  @ApiResponse({ status: 200, description: 'Liste récupérée avec succès.' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un rôle par ID' })
  @ApiResponse({ status: 200, description: 'Rôle trouvé.' })
  @ApiResponse({ status: 404, description: 'Rôle introuvable.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findById(id);
  }
}