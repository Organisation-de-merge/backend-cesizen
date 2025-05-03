import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ActivityTypeService } from './activity-type.service';
import { CreateActivityTypeDto } from './dto/activityType.create.dto';
import { UpdateActivityTypeDto } from './dto/activityType.update.dto';
import { ResponseActivityTypeDto } from './dto/activityType.response.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/role.guard';
import { MinRoleLevel } from '../../common/decorators/roles.decorator';


@ApiTags('Activity Types')
@ApiBearerAuth()
@Controller('activities/types')
export class ActivityTypeController {
  constructor(private readonly service: ActivityTypeService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Lister tous les types',
    description: 'Récupère tous les types d’activités de la base de données.'
  })
  @ApiResponse({
    status: 200,
    description: 'Liste récupérée avec succès.',
    type: [ResponseActivityTypeDto],
  })
  @ApiResponse({
      status: 404,
      description: 'Aucun type trouvé.',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un type par ID',
    description: 'Récupère un type d’activité spécifique par son ID.'
  })
  @ApiResponse({
      status: 200,
      description: 'Type récupéré avec succès.',
      type: ResponseActivityTypeDto,
  })
  @ApiResponse({
      status: 404,
      description: 'Type non trouvé.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Post()
  @ApiOperation({ 
    summary: 'Créer un type d’activité',
    description: 'Crée un nouveau type d’activité.'
  })
  @ApiResponse({
      status: 201,
      description: 'Type créé avec succès.',
      type: ResponseActivityTypeDto,
  })
  @ApiResponse({
      status: 400,
      description: 'Erreur de validation.',
  })
  create(@Body() dto: CreateActivityTypeDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Put(':id')
  @ApiOperation({ 
    summary: 'Modifier un type d’activité',
    description: 'Met à jour un type d’activité existant.'
  })
  @ApiResponse({
      status: 200,
      description: 'Type mis à jour avec succès.',
      type: ResponseActivityTypeDto,
  })
  @ApiResponse({
        status: 404,
        description: 'Type non trouvé.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActivityTypeDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Supprimer un type d’activité',
    description: 'Supprime un type d’activité de la base de données.'
  })
  @ApiResponse({
      status: 200,
      description: 'Type supprimé avec succès.',
  })
  @ApiResponse({
          status: 404,
          description: 'Type non trouvé.',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}