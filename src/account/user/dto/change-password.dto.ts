import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'ancienMotDePasse123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'nouveauMotDePasse456' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}