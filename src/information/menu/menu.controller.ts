import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/menu.create.dto';
import { UpdateMenuDto } from './dto/menu.update.dto';
import { ResponseMenuDto } from './dto/menu.response.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/role.guard';
import { MinRoleLevel } from '../../common/decorators/roles.decorator';

@ApiTags('Menus')
@ApiBearerAuth()
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Post('/menus/create')
  @ApiOperation({ 
    summary: 'Créer un menu d’informations',
    description: 'Crée un nouveau menu d’informations.'
  })
  @ApiResponse({
      status: 201,
      description: 'Menu créé avec succès.',
      type: ResponseMenuDto,
  })
  @ApiResponse({
      status: 400,
      description: 'Erreur de validation des données d’entrée.',
  })
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Get('/menus')
  @ApiOperation({ 
    summary: 'Lister tous les menus',
    description: 'Récupère tous les menus d’informations de la base de données.'
  })
  @ApiResponse({
      status: 200,
      description: 'Liste récupérée avec succès.',
      type: [ResponseMenuDto],
  })
  @ApiResponse({
          status: 404,
          description: 'Aucun menu trouvé.',
  })
  findAll() {
    return this.menuService.findAll();
  }

  @Get('/menus/:id')
  @ApiOperation({ 
    summary: 'Récupérer un menu par ID avec les pages liées',
    description: 'Récupère un menu d’informations par son ID, y compris les pages qui lui sont liées.'
  })
  @ApiResponse({
      status: 200,
      description: 'Menu trouvé avec succès.',
      type: ResponseMenuDto,
  })
  @ApiResponse({
          status: 404,
          description: 'Menu non trouvé.',
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Put('/menus/:id')
  @ApiOperation({ 
    summary: 'Modifier un menu',
    description: 'Met à jour les informations d’un menu d’informations existant.'
  })
  @ApiResponse({
      status: 200,
      description: 'Menu mis à jour avec succès.',
      type: ResponseMenuDto,
  })
  @ApiResponse({
          status: 404,
          description: 'Menu non trouvé.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Delete('/menus/:id')
  @ApiOperation({ 
    summary: 'Supprimer un menu',
    description: 'Supprime un menu d’informations de la base de données.'
  })
  @ApiResponse({
      status: 200,
      description: 'Menu supprimé avec succès.',
  })
  @ApiResponse({
          status: 404,
          description: 'Menu non trouvé.',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }
}