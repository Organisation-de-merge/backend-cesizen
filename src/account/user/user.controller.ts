import { Body, Controller, Get, Post, Put, Patch, Delete, Param, ParseIntPipe, ParseBoolPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.create.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/role.guard';
import { MinRoleLevel } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(1)
  @Get('/getUsers')
  @ApiOperation({ 
    summary: 'Lister tous les utilisateurs', 
    description: 'Récupère tous les utilisateurs de la base de données.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste récupérée avec succès.',
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun utilisateur trouvé.' 
  })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(1)
  @Get('/getUsersByStatus')
  @ApiOperation({ 
    summary: 'Lister tous les utilisateurs en fonction de leur statut',
    description: 'Récupère tous les utilisateurs en fonction de leur statut (actif/inactif).'
  })
  @ApiQuery({
    name: 'isActive',
    required: true,
    type: Boolean,
    description: 'Filtre les utilisateurs actifs (true) ou inactifs (false)',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste récupérée avec succès.',
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun utilisateur trouvé.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.'
  })
  findAllByStatus(@Query('isActive', ParseBoolPipe) isActive: boolean) {
    return isActive
      ? this.userService.findAllActive()
      : this.userService.findAllInactive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(1)
  @Get('/getUserById/:id')
  @ApiOperation({ 
    summary: 'Récupérer un utilisateur par ID',
    description: 'Récupère un utilisateur spécifique en fonction de son ID.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur trouvé.', 
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Utilisateur introuvable.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Post('/createUser')
  @ApiOperation({ 
    summary: 'Créer un nouvel utilisateur',
    description: 'Crée un nouvel utilisateur dans la base de données.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Utilisateur créé avec succès.', 
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Put('/updateUser/:id')
  @ApiOperation({ 
    summary: 'Modifier un utilisateur',
    description: 'Met à jour les informations d\'un utilisateur existant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur mis à jour', 
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Utilisateur introuvable.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(80)
  @Delete('/disableUser/:id')
  @ApiOperation({ 
    summary: 'Désactiver un utilisateur',
    description: 'Désactive un utilisateur sans le supprimer de la base de données.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur désactivé', 
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Utilisateur introuvable.' 
  })
  @ApiResponse({
    status: 400, 
    description: 'Erreur de validation.' 
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.disable(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(80)
  @Put('/restoreUser/:id')
  @ApiOperation({ 
    summary: 'Restaurer un utilisateur désactivé',
    description: 'Restaure un utilisateur désactivé dans la base de données.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur restauré', 
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Utilisateur introuvable.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.userService.restore(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @MinRoleLevel(100)
  @Delete('/deleteUser/:id')
  @ApiOperation({
    summary: 'Supprimer un utilisateur',
    description: 'Supprime un utilisateur de la base de données.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur supprimé', 
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Utilisateur introuvable.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Erreur de validation.' 
  })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

@ApiTags('Profil')
@Controller('profil')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Voir son propre profil' })
  @ApiResponse({ status: 200, description: 'Données utilisateur récupérées' })
  getProfile(@CurrentUser() user) {
    return this.userService.profil(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/update')
  @ApiOperation({ summary: 'Mettre à jour ses informations personnelles' })
  @ApiResponse({ status: 200, description: 'Infos mises à jour' })
  updateMe(@CurrentUser() user, @Body() dto: UpdateUserDto) {
    return this.userService.update(user.id, dto);
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Changer son mot de passe' })
  @ApiResponse({ status: 200, description: 'Mot de passe modifié' })
  async changePassword(
    @CurrentUser() user,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.id, dto.oldPassword, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/delete')
  @ApiOperation({ summary: 'Supprimer définitivement son compte' })
  @ApiResponse({ status: 200, description: 'Compte supprimé' })
  deleteSelf(@CurrentUser() user) {
    return this.userService.delete(user.id);
  }
}