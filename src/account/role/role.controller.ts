import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { RoleResponseDto } from './dto/role.response.dto';
import { CreateRoleDto } from './dto/role.create.dto';
import { UpdateRoleDto } from './dto/role.update.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/role.guard';
import { MinRoleLevel } from '../../common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';

@ApiTags('Roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@MinRoleLevel(100)
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/getAllRoles')
  @ApiOperation({ 
    summary: 'Lister les rôles actifs',
    description: 'Récupère tous les rôles actifs de la base de données.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste récupérée avec succès.', 
    type: [RoleResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun rôle trouvé.' 
  })
  findAll() {
    return this.roleService.findAll();
  }

  @Get('/getAllActiveRoles')
  @ApiOperation({ 
    summary: 'Lister les rôles actifs',
    description: 'Récupère tous les rôles actifs de la base de données.'
  })
  @ApiResponse({
    status: 200, 
    description: 'Liste récupérée avec succès.',
    type: [RoleResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun rôle actif trouvé.' 
  })
  findAllActive() {
    return this.roleService.findAllActive();
  }

  @Get('/getAllInactiveRoles')
  @ApiOperation({ 
    summary: 'Lister les rôles inactifs',
    description: 'Récupère tous les rôles inactifs de la base de données.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste récupérée avec succès.',
    type: [RoleResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun rôle inactif trouvé.' 
  })
  findAllInactive() {
    return this.roleService.findAllInactive();
  }

  @Get('/getRoleById/:id')
  @ApiOperation({ 
    summary: 'Récupérer un rôle par ID',
    description: 'Récupère un rôle spécifique en fonction de son ID.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rôle récupéré avec succès.',
    type: [RoleResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rôle non trouvé.' 
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findById(id);
  }

  @Post('/createRole')
  @ApiOperation({ 
    summary: 'Créer un rôle',
    description: 'Crée un nouveau rôle dans la base de données.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Rôle créé avec succès.',
    type: [RoleResponseDto]
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Modifier un rôle',
    description: 'Met à jour un rôle existant en fonction de son ID.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rôle mis à jour avec succès.', 
    type: [RoleResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rôle non trouvé.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete('/disableRole/:id')
  @ApiOperation({ 
    summary: 'Désactiver un rôle',
    description: 'Désactive un rôle en fonction de son ID.'
   })
  @ApiResponse({ 
    status: 200, 
    description: 'Rôle désactivé avec succès.',
    type: [RoleResponseDto]
  })
  @ApiResponse({
    status: 404, 
    description: 'Rôle non trouvé.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.disable(id);
  }

  @Put('/restoreRole/:id')
  @ApiOperation({
    summary: 'Restaurer un rôle',
    description: 'Restaure un rôle désactivé en fonction de son ID.'
  })
  @ApiResponse({
    status: 200, 
    description: 'Rôle restauré avec succès.',
    type: [RoleResponseDto]
  })
  @ApiResponse({
    status: 404, 
    description: 'Rôle non trouvé.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.restore(id);
  }
}