
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue([]),
    findAllByStatus: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockImplementation(id => Promise.resolve({ id })),
    create: jest.fn().mockImplementation(dto => Promise.resolve({ id: 1, ...dto })),
    update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
    disable: jest.fn().mockResolvedValue({}),
    restore: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue(id => Promise.resolve({ id })),
    deleteUser: jest.fn().mockResolvedValue(id => Promise.resolve({ id })),
    getProfile: jest.fn().mockResolvedValue({}),
    updateMe: jest.fn().mockResolvedValue({}),
    deleteSelf: jest.fn().mockResolvedValue({}),
    changePassword: jest.fn().mockResolvedValue({}),
    profil: jest.fn().mockImplementation(id => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return users', async () => {
    expect(await controller.findAll()).toEqual([]);
  });

  it('should return a user by ID', async () => {
    expect(await controller.findOne(1)).toEqual({ id: 1 });
  });

  it('should create a user', async () => {
    const dto = { email: 'test@example.com', name: 'Test', password: 'pass', confirmPassword: 'pass', roleId: 2 };
    expect(await controller.create(dto as any)).toEqual(expect.objectContaining({ email: dto.email }));
  });
});
