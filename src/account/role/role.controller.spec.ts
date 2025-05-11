
import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/role.create.dto';
import { UpdateRoleDto } from './dto/role.update.dto';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findAllActive: jest.fn().mockResolvedValue([]),
            findAllInactive: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue({ id: 1, label: 'Admin', level: 100 }),
            create: jest.fn().mockResolvedValue({ id: 1, label: 'Admin', level: 100 }),
            update: jest.fn().mockResolvedValue({ id: 1, label: 'Updated', level: 1 }),
            disable: jest.fn().mockResolvedValue({ id: 1 }),
            restore: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return roles from findAll', async () => {
    expect(await controller.findAll()).toEqual([]);
  });

  it('should return a role by id', async () => {
    expect(await controller.findById(1)).toEqual({ id: 1, label: 'Admin', level: 100 });
  });

  it('should create a role', async () => {
    const dto: CreateRoleDto = { label: 'Admin', level: 100 };
    expect(await controller.create(dto)).toEqual({ id: 1, label: 'Admin', level: 100 });
  });

  it('should update a role', async () => {
    const dto: UpdateRoleDto = { label: 'Updated', level: 1 };
    expect(await controller.update(1, dto)).toEqual({ id: 1, label: 'Updated', level: 1 });
  });
});
