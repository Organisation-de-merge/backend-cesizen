import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Gestionnaire' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  level: number;
}