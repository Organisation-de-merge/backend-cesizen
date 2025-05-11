import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue({ id: 1 }),
            },
            activity: {
              findUnique: jest.fn().mockResolvedValue({ id: 10 }),
            },
            favorite: {
              upsert: jest.fn().mockResolvedValue('upserted'),
              delete: jest.fn().mockResolvedValue('deleted'),
              findMany: jest.fn().mockResolvedValue(['favorite']),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should add a favorite', async () => {
    const result = await service.add(1, 10);
    expect(result).toBe('upserted');
  });

  it('should remove a favorite', async () => {
    const result = await service.remove(1, 10);
    expect(result).toBe('deleted');
  });

  it('should find all favorites', async () => {
    const result = await service.findAll(1);
    expect(result).toEqual(['favorite']);
  });
});
