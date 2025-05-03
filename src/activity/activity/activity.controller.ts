import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/activity.create.dto';
import { UpdateActivityDto } from './dto/activity.update.dto';
import { ResponseActivityDto } from './dto/activity.response.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { MinRoleLevel } from 'src/common/decorators/roles.decorator';
import { ActivityStatus } from './dto/activity.create.dto';

@ApiTags('Activities')
@ApiBearerAuth()
@Controller('activities')
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Lister toutes les activités',
    description: 'Récupère toutes les activités de la base de données.'
  })
  @ApiResponse({
    status: 200,
    description: 'Liste récupérée avec succès.',
    type: [ResponseActivityDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune activité trouvée.',
  })
  @ApiQuery({ name: 'status', required: false, enum: ActivityStatus })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'typeId', required: false, type: Number })
  @ApiQuery({ name: 'stressLevel', required: false, type: Number })
  findAll(
    @Query('status') status: string = 'PUBLISHED',
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('query') query?: string,
    @Query('limit') limit?: number,
    @Query('typeId', new DefaultValuePipe(undefined)) typeId?: number,
    @Query('stressLevel', new DefaultValuePipe(undefined)) stressLevel?: number,
  ) {
    return this.service.findAll(query, limit, page, typeId, stressLevel, status);
  }

  @Get('latest')
  @ApiOperation({ 
    summary: 'Obtenir les dernières activités publiées',
    description: 'Récupère les dernières activités publiées, avec un nombre maximum spécifié.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dernières activités récupérées.', 
    type: [ResponseActivityDto] 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucune activité trouvée.' 
  })
  findLatest(@Query('count') count: string) {
      const limit = parseInt(count, 10) || 5;
      return this.service.findLatest(limit);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer une activité par ID',
    description: 'Récupère une activité spécifique en fonction de son ID.'
  })
  @ApiResponse({
    status: 200,
    description: 'Activité récupérée avec succès.',
    type: ResponseActivityDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune activité trouvée avec cet ID.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Post()
  @ApiOperation({ 
    summary: 'Créer une activité',
    description: 'Crée une nouvelle activité dans la base de données.'
  })
  @ApiResponse({
    status: 201,
    description: 'Activité créée avec succès.',
    type: ResponseActivityDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation.',
  })
  create(@Body() dto: CreateActivityDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Put(':id')
  @ApiOperation({ 
    summary: 'Mettre à jour une activité',
    description: 'Met à jour les informations d\'une activité existante.'
  })
  @ApiResponse({
    status: 200,
    description: 'Activité mise à jour avec succès.',
    type: ResponseActivityDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune activité trouvée avec cet ID.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActivityDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Supprimer une activité',
    description: 'Supprime une activité spécifique en fonction de son ID.'
  })
  @ApiResponse({
    status: 200,
    description: 'Activité supprimée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune activité trouvée avec cet ID.',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}