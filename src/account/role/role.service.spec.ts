import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RoleService', () => {
  let service: RoleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService, PrismaService],
    }).compile();

    service = module.get<RoleService>(RoleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new role', async () => {
    const dto = { label: 'Test', level: 1 };
    const mockReturn = { id: 1, ...dto };

    jest.spyOn(prisma.role, 'create').mockResolvedValue(mockReturn as any);

    const result = await service.create(dto);
    expect(result).toEqual(mockReturn);
  });

  it('should return all roles', async () => {
    const mockRoles = [{ id: 1, label: 'Admin', level: 100 }];

    jest.spyOn(prisma.role, 'findMany').mockResolvedValue(mockRoles as any);

    const result = await service.findAll();
    expect(result).toEqual(mockRoles);
  });
});