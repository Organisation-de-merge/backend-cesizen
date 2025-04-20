import { IsEmail, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: "Identifiant de l\'utilisateur" })
  @IsInt()
  id: string;

  @ApiProperty({ description: "Email de l\'utilisateur" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Nom de l\'utilisateur" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Identifiant du role utilisateur" })
  roleId: number;
}