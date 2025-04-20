import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe, ParseBoolPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.create.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UpdateUserDto } from './dto/user.update.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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