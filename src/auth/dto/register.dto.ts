import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMatchFields } from 'src/common/decorators/isMatchFields.decorator';

export class RegisterDto {
  @ApiProperty({ description: 'Email de l\'utilisateur'})
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Nom de l\'utilisateur'})
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mot de passe de l\'utilisateur' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Confirmation du mot de passe de l\'utilisateur' })
  @IsString()
  @IsMatchFields('password', { message: 'Les mots de passe ne correspondent pas' })
  @MinLength(6)
  confirmPassword: string;
}