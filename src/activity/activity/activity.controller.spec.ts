import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/activity.create.dto';
import { UpdateActivityDto } from './dto/activity.update.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';

describe('ActivityController', () => {
  let controller: ActivityController;
  let service: ActivityService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findLatest: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue([]),
    delete: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        { provide: ActivityService, useValue: mockService },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ActivityController>(ActivityController);
    service = module.get<ActivityService>(ActivityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all activities', async () => {
    await controller.findAll('PUBLISHED', 1);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get latest activities', async () => {
    await controller.findLatest('5');
    expect(service.findLatest).toHaveBeenCalledWith(5);
  });

  it('should get an activity by id', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create an activity', async () => {
    const dto = new CreateActivityDto();
    Object.assign(dto, {
      name: 'Test',
      description: 'Test desc',
      duration: 60,
      stressLevel: 3,
      typeId: 1,
      status: 'PUBLISHED'
    });
    const mockFile = { filename: 'test-thumbnail.jpg' } as Express.Multer.File;
    await controller.create(mockFile, dto);
    expect(service.create).toHaveBeenCalled();
  });

  it('should update an activity', async () => {
    const dto = new UpdateActivityDto();
    const mockFile = { filename: 'test-thumbnail.jpg' } as Express.Multer.File;
    await controller.update(1, mockFile, dto);
    expect(service.update).toHaveBeenCalled();
  });

  it('should delete an activity', async () => {
    await controller.delete(1);
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
