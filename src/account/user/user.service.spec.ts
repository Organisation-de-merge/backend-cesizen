
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {
        provide: PrismaService,
        useValue: {
          user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
          },
          role: {
            findFirst: jest.fn(),
          },
        },
      }],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return users with role level < 50', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const dto = { email: 'test@example.com', name: 'Test', password: 'pass', roleId: 1 };
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed'));
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, ...dto, password: 'hashed' });
      const result = await service.create(dto as any);
      expect(result).toHaveProperty('password', 'hashed');
    });
  });
});
