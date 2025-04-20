import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/page.create.dto';
import { UpdatePageDto } from './dto/page.update.dto';
import { ResponsePageDto } from './dto/page.response.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/role.guard';
import { MinRoleLevel } from '../../common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Pages')
@UseGuards(JwtAuthGuard, RolesGuard)
@MinRoleLevel(100)
@ApiBearerAuth()
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post('/pages/createPage')
  @ApiOperation({ 
    summary: 'Créer une page d’information',
    description: 'Crée une nouvelle page d’information dans le système.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Page créée avec succès.', 
    type: [ResponsePageDto]})
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  create(@Body() dto: CreatePageDto) {
    return this.pageService.create(dto);
  }

  @Get('/pages')
  @ApiOperation({ 
    summary: 'Lister toutes les pages',
    description: 'Récupère toutes les pages d’information disponibles.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des pages récupérée avec succès.', 
    type: [ResponsePageDto]
  })
  @ApiResponse({
    status: 404, 
    description: 'Aucune page trouvée.' 
  })
  findAll() {
    return this.pageService.findAll();
  }

  @Get('/pages/published')
  @ApiOperation({ 
    summary: 'Lister uniquement les pages publiées',
    description: 'Récupère uniquement les pages d’information qui sont publiées.'
  })
  @ApiResponse({ 
      status: 200, 
      description: 'Liste des pages publiées récupérée avec succès.', 
      type: [ResponsePageDto]
  })
  @ApiResponse({
      status: 404, 
      description: 'Aucune page publiée trouvée.' 
  })
  findPublished() {
    return this.pageService.findPublished();
  }

  @Get('/informtion-pages/:id')
  @ApiOperation({ 
    summary: 'Obtenir une page par ID',
    description: 'Récupère une page d’information spécifique en fonction de son ID.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Page trouvée avec succès.', 
    type: [ResponsePageDto]
  })
  @ApiResponse({ 
        status: 404, 
        description: 'Page introuvable.' 
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.findById(id);
  }

  @Put('/pages/:id')
  @ApiOperation({ 
    summary: 'Modifier une page',
    description: 'Met à jour les informations d’une page d’information existante.'
  })
  @ApiResponse({ 
      status: 200, 
      description: 'Page mise à jour avec succès.', 
      type: [ResponsePageDto]
  })
  @ApiResponse({ 
          status: 404, 
          description: 'Page introuvable.' 
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePageDto) {
    return this.pageService.update(id, dto);
  }

  @Delete('/pages/:id')
  @ApiOperation({ 
    summary: 'Supprimer une page',
    description: 'Supprime une page d’information spécifique en fonction de son ID.'
  })
  @ApiResponse({ 
      status: 200, 
      description: 'Page supprimée avec succès.' 
  })
  @ApiResponse({ 
          status: 404, 
          description: 'Page introuvable.' 
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.pageService.delete(id);
  }
}