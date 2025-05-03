import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Nom du rôle' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Niveau du rôle' })
  @IsInt()
  level: number;
}