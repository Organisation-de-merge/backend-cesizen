import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Query, DefaultValuePipe, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/activity.create.dto';
import { UpdateActivityDto } from './dto/activity.update.dto';
import { ResponseActivityDto } from './dto/activity.response.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { MinRoleLevel } from 'src/common/decorators/roles.decorator';
import { ActivityStatus } from './dto/activity.create.dto';
import { ParseOptionalIntPipe } from 'src/common/pipe/parse-optional-int.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('query') query?: string,
    @Query('limit', ParseOptionalIntPipe) limit?: number,
    @Query('typeId', ParseOptionalIntPipe) typeId?: number,
    @Query('stressLevel', ParseOptionalIntPipe) stressLevel?: number,
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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(60)
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Créer une activité avec image' })
  @ApiBody({
    description: 'Créer une activité avec image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        duration: { type: 'integer' },
        stressLevel: { type: 'integer' },
        typeId: { type: 'integer' },
        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'HIDDEN'] },
        thumbnail: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Activité créée avec succès.', 
    type: ResponseActivityDto 
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const dto = new CreateActivityDto();

    dto.name = body.name;
    dto.description = body.description;
    dto.duration = parseInt(body.duration, 10);
    dto.stressLevel = parseInt(body.stressLevel, 10);
    dto.typeId = parseInt(body.typeId, 10);
    dto.status = body.status;
    dto.publicationDate = body.publicationDate ? new Date(body.publicationDate) : undefined;
    dto.thumbnail = file ? `/uploads/activities/${file.filename}` : undefined;

    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(60)
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Mettre à jour une activité avec image' })
  @ApiBody({
    description: 'Mettre à jour une activité avec image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        duration: { type: 'integer' },
        stressLevel: { type: 'integer' },
        typeId: { type: 'integer' },
        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'HIDDEN'] },
        thumbnail: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Activité mise à jour avec succès.',
    type: ResponseActivityDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const dto = new UpdateActivityDto();

    dto.name = body.name;
    dto.description = body.description;
    dto.duration = parseInt(body.duration, 10);
    dto.stressLevel = parseInt(body.stressLevel, 10);
    dto.typeId = parseInt(body.typeId, 10);
    dto.status = body.status;
    dto.publicationDate = body.publicationDate ? new Date(body.publicationDate) : undefined;
    dto.thumbnail = file ? `/uploads/activities/${file.filename}` : undefined;

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