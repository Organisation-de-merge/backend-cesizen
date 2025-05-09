import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsObject, IsBoolean } from 'class-validator';
import { RoleResponseDto } from '../../role/dto/role.response.dto';

export class UserResponseDto {
  @ApiProperty({ description: "Identifiant de l'utilisateur" })
  @IsInt()
  id: number;

  @ApiProperty({ description: "Nom de l'utilisateur" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Email de l'utilisateur" })
  @IsString()
  email: string;

  @ApiProperty({ description: "Identifiant du rôle utilisateur" })
  @IsInt()
  roleId: number;

  @ApiProperty({ description: "Rôle de l'utilisateur" })
  @IsObject()
  role: RoleResponseDto;

  @ApiProperty({ description: "Statut actif/inactif" })
  @IsBoolean()
  isActive: boolean;
}