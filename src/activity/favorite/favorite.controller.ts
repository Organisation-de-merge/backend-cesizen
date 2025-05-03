import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guard/role.guard';
import { MinRoleLevel } from '../../common/decorators/roles.decorator';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post(':id')
  @ApiOperation({ 
    summary: 'Ajouter une activité aux favoris',
    description: 'Ajoute une activité spécifique aux favoris de l’utilisateur.'
  })
  @ApiResponse({
    status: 200,
    description: 'Activité ajoutée aux favoris avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Activité non trouvée.',
  })
  add(@Param('id', ParseIntPipe) activityId: number, @CurrentUser() user) {
    return this.favoriteService.add(user.id, activityId);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Retirer une activité des favoris',
    description: 'Retire une activité spécifique des favoris de l’utilisateur.'
  })
  remove(@Param('id', ParseIntPipe) activityId: number, @CurrentUser() user) {
    return this.favoriteService.remove(user.id, activityId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lister les activités favorites',
    description: 'Récupère toutes les activités favorites de l’utilisateur.'
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des activités favorites récupérée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune activité favorite trouvée.',
  })
  findAll(@CurrentUser() user) {
    return this.favoriteService.findAll(user.id);
  }

  @UseGuards(RolesGuard)
  @MinRoleLevel(80)
  @Get('/user/:id')
  @ApiOperation({ 
    summary: 'Lister les favoris d’un utilisateur spécifique',
    description: 'Récupère toutes les activités favorites d’un utilisateur spécifique.'
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des activités favorites récupérée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune activité favorite trouvée.',
  })
  findByUserId(@Param('id', ParseIntPipe) userId: number) {
    return this.favoriteService.findAll(userId);
  }
}
