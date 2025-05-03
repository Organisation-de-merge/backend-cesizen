import { ApiProperty } from '@nestjs/swagger';
import { PageStatus } from './page.create.dto';

export class ResponsePageDto {
  @ApiProperty({ description: 'Identifiant unique de la page' })
  id: number;

  @ApiProperty({ description: 'Titre de la page' })
  title: string;

  @ApiProperty({ description: 'Contenu de la page' })
  content: string;

  @ApiProperty({ description: 'URL de la miniature', required: false })
  thumbnail?: string;

  @ApiProperty({ enum: PageStatus, description: 'Statut de publication de la page' })
  status: PageStatus;

  @ApiProperty({ description: 'Date de publication', required: false })
  publishedAt?: Date;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  updatedAt: Date;
}