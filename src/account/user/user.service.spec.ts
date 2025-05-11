
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

  describe('update', () => {
    it('should update user and hash password if provided', async () => {
      const dto = { email: 'test@test.fr', name: 'Test', password: 'newpass' };
      const user = { id: 1, email: 'test@test.fr', name: 'Test', password: 'oldpass' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, ...dto });
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed'));
      const result = await service.update(1, dto as any);
      expect(result).toHaveProperty('password', 'hashed');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...dto,
          password: 'hashed',
        },
      });
    });
  });

  it('should disable user', async () => {
    const user = { id: 1, email: 'test@test.fr', name: 'Test', password: 'oldpass' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, isActive: false });
    const result = await service.disable(1);
    expect(result).toHaveProperty('isActive', false);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: false },
    });
  });

  it('should enable user', async () => {
    const user = { id: 1, email: 'testàtest.fr', name: 'Test', password: 'oldpass' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user); 
    (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, isActive: true });
    const result = await service.restore(1);
    expect(result).toHaveProperty('isActive', true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: true },
    });
  });

  it('should delete user', async () => {
    const user = { id: 1, email: 'testàtest.fr', name: 'Test', password: 'oldpass' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, isActive: false });
    (prisma.user.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    const result = await service.delete(1);
    expect(result).toHaveProperty('isActive', false);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: false },
    });
  });

  it('should change password', async () => {
    const oldPassword = 'oldpass';
    const newPassword = 'newhash';
    const user = { id: 1, email: 'testàtest.fr', name: 'Test', password: 'oldpass' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, password: 'hashed' });
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed'));
    const result = await service.changePassword(1, oldPassword, newPassword);
    expect(result).toHaveProperty('password', 'hashed');
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        password: 'hashed',
      },
    });
  });

  it('should return user profile', async () => {
    const user = { id: 1, email: 'test@test.fr', name: 'Test', password: 'oldpass' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.role.findFirst as jest.Mock).mockResolvedValue({ id: 1, label: 'Admin', level: 100 });
    const result = await service.profil(1);
    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: 1,
      role: { id: 1, label: 'Admin', level: 100 },
      isActive: true,
    });
  });

  it('sould find by id', async () => {
    const user = { id: 1, email: 'testàtest.fr', name: 'Test', password: 'oldpass' }; 
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.role.findFirst as jest.Mock).mockResolvedValue({ id: 1, label: 'Admin', level: 100 });
    const result = await service.findById(1);
    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: 1,
      role: { id: 1, label: 'Admin', level: 100 },
      isActive: true,
    });
  });

  it('should find all inactive users', async () => {
    const users = [
      { id: 1, email: 'test@test.fr', name: 'Test', password: 'oldpass', isActive: false, roleId: 1 },
      { id: 2, email: 'test2@test.fr ', name: 'Test2', password: 'oldpass2', isActive: false, roleId: 2 },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(users);
    (prisma.role.findFirst as jest.Mock).mockResolvedValue({ id: 1, label: 'Admin', level: 100 });
    const result = await service.findAllInactive();
    expect(result).toEqual(users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: { id: 1, label: 'Admin', level: 100 },
      isActive: false,
    })));
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        isActive: false,
        role: {
          level: {
            not: {
              gte: 50,
            },
          },
        },
      },
      include: { role: true },
    });
  });

  it('should find all active users', async () => {
    const users = [
      { id: 1, email: 'test@test.fr', name: 'Test', password: 'oldpass', isActive: true, roleId: 1 },
      { id: 2, email: 'test2@test.fr ', name: 'Test2', password: 'oldpass2', isActive: true, roleId: 2 },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(users);
    (prisma.role.findFirst as jest.Mock).mockResolvedValue({ id: 1, label: 'Admin', level: 100 });
    const result = await service.findAllActive();
    expect(result).toEqual(users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: { id: 1, label: 'Admin', level: 100 },
      isActive: true,
    })));
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        isActive: true,
        role: {
          level: {
            not: {
              gte: 50,
            },
          },
        },
      },
      include: { role: true },
    });
  });
});
