import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypeController } from './activity-type.controller';
import { ActivityTypeService } from './activity-type.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/role.guard';

describe('ActivityTypeController', () => {
  let controller: ActivityTypeController;
  let service: ActivityTypeService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, label: 'Sport' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, label: 'Sport' }),
    create: jest.fn().mockResolvedValue({ id: 1, label: 'Sport' }),
    update: jest.fn().mockResolvedValue({ id: 1, label: 'Updated Sport' }),
    delete: jest.fn().mockResolvedValue({ id: 1, label: 'Deleted Sport' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityTypeController],
      providers: [
        { provide: ActivityTypeService, useValue: mockService },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ActivityTypeController>(ActivityTypeController);
    service = module.get<ActivityTypeService>(ActivityTypeService);
  });

  it('should get all activity types', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, label: 'Sport' }]);
  });

  it('should get activity type by id', async () => {
    expect(await controller.findOne(1)).toEqual({ id: 1, label: 'Sport' });
  });

  it('should create a new activity type', async () => {
    expect(await controller.create({ label: 'Sport' })).toEqual({ id: 1, label: 'Sport' });
  });

  it('should update activity type', async () => {
    expect(await controller.update(1, { label: 'Updated Sport' })).toEqual({ id: 1, label: 'Updated Sport' });
  });

  it('should delete activity type', async () => {
    expect(await controller.delete(1)).toEqual({ id: 1, label: 'Deleted Sport' });
  });
});
