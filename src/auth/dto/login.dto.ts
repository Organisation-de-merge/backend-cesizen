import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email de l\'utilisateur'})
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mot de passe de l\'utilisateur'})
  @IsString()
  password: string;
}