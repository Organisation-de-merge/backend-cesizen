import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete, UseGuards, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/page.create.dto';
import { UpdatePageDto } from './dto/page.update.dto';
import { ResponsePageDto } from './dto/page.response.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/role.guard';
import { MinRoleLevel } from '../../common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Pages')
@ApiBearerAuth()
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
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
  @ApiQuery({ name: 'status', required: false, enum: ['PUBLISHED', 'DRAFT', 'HIDDEN'] })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(
    @Query('status') status: string = 'PUBLISHED',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('query') query?: string,
    @Query('limit') limit?: number,
  ) {
    return this.pageService.findAll(query, limit, page, status);
  }

  @Get('latest')
  @ApiOperation({
    summary: 'Obtenir les dernières pages publiées',
    description: 'Récupère les dernières pages publiées, avec un nombre maximum spécifié.'
  })
  @ApiResponse({
    status: 200, 
    description: 'Dernières pages récupérées.', 
    type: [ResponsePageDto] 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucune page trouvée.' 
  })
  findLatest(@Query('count') count: string) {
    const limit = parseInt(count, 10) || 5;
    return this.pageService.findLatest(limit);
  }

  @Get('/:id')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Post('/createPage')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Put('/:id')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Delete('/:id')
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