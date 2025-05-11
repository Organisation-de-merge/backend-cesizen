import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypeService } from './activity-type.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ActivityTypeService', () => {
  let service: ActivityTypeService;
  let prisma: PrismaService;

  const mockPrisma = {
    activityType: {
      create: jest.fn().mockResolvedValue({ id: 1, label: 'Sport' }),
      findMany: jest.fn().mockResolvedValue([{ id: 1, label: 'Sport' }]),
      findUnique: jest.fn().mockResolvedValue({ id: 1, label: 'Sport' }),
      update: jest.fn().mockResolvedValue({ id: 1, label: 'Updated Sport' }),
      delete: jest.fn().mockResolvedValue({ id: 1, label: 'Deleted Sport' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityTypeService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ActivityTypeService>(ActivityTypeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create an activity type', async () => {
    expect(await service.create({ label: 'Sport' })).toEqual({ id: 1, label: 'Sport' });
  });

  it('should return all activity types', async () => {
    expect(await service.findAll()).toEqual([{ id: 1, label: 'Sport' }]);
  });

  it('should return one activity type by id', async () => {
    expect(await service.findOne(1)).toEqual({ id: 1, label: 'Sport' });
  });

  it('should update an activity type', async () => {
    expect(await service.update(1, { label: 'Updated Sport' })).toEqual({ id: 1, label: 'Updated Sport' });
  });

  it('should delete an activity type', async () => {
    expect(await service.delete(1)).toEqual({ id: 1, label: 'Deleted Sport' });
  });
});
