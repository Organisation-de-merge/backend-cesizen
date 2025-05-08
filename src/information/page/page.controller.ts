import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete, UseGuards, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/page.create.dto';
import { UpdatePageDto } from './dto/page.update.dto';
import { ResponsePageDto } from './dto/page.response.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/role.guard';
import { MinRoleLevel } from '../../common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ParseOptionalIntPipe } from '../../common/pipe/parse-optional-int.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config'; 
import { UseInterceptors, UploadedFile, Req } from '@nestjs/common';

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
    @Query('limit', ParseOptionalIntPipe ) limit?: number,
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

  @Post('/createPage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Créer une page avec image' })
  @ApiBody({
    description: 'Créer une page avec image',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'HIDDEN'] },
        thumbnail: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Page créée avec succès.',
    type: ResponsePageDto,
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {

    const dto = new CreatePageDto();

    dto.title = body.title;
    dto.content = body.content;
    dto.status = body.status;
    dto.thumbnail = file ? `/uploads/pages/${file.filename}` : undefined;

    return this.pageService.create(dto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Modifier une page avec image' })
  @ApiBody({
    description: 'Modifier une page avec image',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'HIDDEN'] },
        thumbnail: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Page mise à jour avec succès.',
    type: [ResponsePageDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Page introuvable.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
  
    const dto = new UpdatePageDto();
    dto.title = body.title;
    dto.content = body.content;
    dto.status = body.status;
    dto.thumbnail = file ? `/uploads/pages/${file.filename}` : undefined;
  
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