import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  
  @Injectable()
  export class ParseOptionalIntPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): number | undefined {
      if (value === undefined || value === null || value === '') {
        return undefined;
      }
  
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        throw new BadRequestException(`${metadata.data} doit être un nombre entier valide`);
      }
  
      return parsed;
    }
  }