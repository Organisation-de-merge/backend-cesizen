import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: {
            add: jest.fn().mockResolvedValue('added'),
            remove: jest.fn().mockResolvedValue('removed'),
            findAll: jest.fn().mockResolvedValue(['activity']),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);
  });

  it('should add a favorite', async () => {
    const result = await controller.add(1, { id: 10 });
    expect(result).toBe('added');
  });

  it('should remove a favorite', async () => {
    const result = await controller.remove(1, { id: 10 });
    expect(result).toBe('removed');
  });

  it('should find all favorites for current user', async () => {
    const result = await controller.findAll({ id: 1 });
    expect(result).toEqual(['activity']);
  });

  it('should find all favorites by user id', async () => {
    const result = await controller.findByUserId(1);
    expect(result).toEqual(['activity']);
  });
});
