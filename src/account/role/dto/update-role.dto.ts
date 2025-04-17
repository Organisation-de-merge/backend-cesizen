import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Manager' })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({ example: 80 })
  @IsInt()
  @IsOptional()
  level?: number;
}