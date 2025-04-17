import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getAllUsers')
  @ApiOperation({ 
    summary: 'Lister tous les utilisateurs', 
    description: 'Récupère tous les utilisateurs de la base de données.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste récupérée avec succès.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun utilisateur trouvé.' 
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('/getAllActiveUsers')
  @ApiOperation({ 
    summary: 'Lister tous les utilisateurs actifs',
    description: 'Récupère tous les utilisateurs actifs de la base de données.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste récupérée avec succès.'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun utilisateur actif trouvé.' 
  })
  findAllActive() {
    return this.userService.findAllActive();
  }

  @Get('/getAllInactiveUsers')
  @ApiOperation({ 
    summary: 'Lister tous les utilisateurs inactifs',
    description: 'Récupère tous les utilisateurs inactifs de la base de données.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste récupérée avec succès.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun utilisateur inactif trouvé.' 
  })
  findAllInactive() {
    return this.userService.findAllInactive();
  }

  @Get('/getUserById/:id')
  @ApiOperation({ 
    summary: 'Récupérer un utilisateur par ID',
    description: 'Récupère un utilisateur spécifique en fonction de son ID.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur trouvé.' 
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
    description: 'Utilisateur créé avec succès.' 
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
    description: 'Utilisateur mis à jour' 
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
    description: 'Utilisateur désactivé' 
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
    description: 'Utilisateur restauré' 
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
    description: 'Utilisateur supprimé' 
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