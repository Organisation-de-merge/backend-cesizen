import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ActivityService', () => {
  let service: ActivityService;

  const mockPrisma = {
    activity: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an activity', async () => {
    const dto = {
      name: 'Test',
      description: 'desc',
      duration: 45,
      stressLevel: 2,
      status: 'PUBLISHED',
      typeId: 1
    };
    await service.create(dto as any);
    expect(mockPrisma.activity.create).toHaveBeenCalled();
  });

  it('should find all activities', async () => {
    await service.findAll();
    expect(mockPrisma.activity.findMany).toHaveBeenCalledWith({
      include: { type: true },
    });
  });

  it('should find an activity by id', async () => {
    await service.findOne(1);
    expect(mockPrisma.activity.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { type: true },
    });
  });

  it('should find the 5 last activity', async () => {
    await service.findLatest(5);
    expect(mockPrisma.activity.findUnique).toHaveBeenCalledWith({
      where: { limit: 5 },
      include: { type: true },
    });
  });

  it('should update an activity', async () => {
    const dto = { name: 'Updated' };
    await service.update(1, dto as any);
    expect(mockPrisma.activity.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should delete an activity', async () => {
    await service.delete(1);
    expect(mockPrisma.activity.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
