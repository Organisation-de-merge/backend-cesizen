import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMatchFields } from '../../../common/decorators/isMatchFields.decorator';

export class CreateUserDto {
  @ApiProperty({ description: 'Email de l\'utilisateur' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Nom de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mot de passe de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Confirmation du mot de passe de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsMatchFields('password', { message: 'Les mots de passe ne correspondent pas' })
  confirmPassword: string;

  @ApiProperty({ example: 2, description: 'ID du rôle à assigner' })
  roleId: number;
}