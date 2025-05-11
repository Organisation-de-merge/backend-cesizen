import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MenuService', () => {
  let service: MenuService;
  let prisma: PrismaService;

  const mockPrisma = {
    informationMenu: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    informationPage: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a menu', async () => {
    const dto = { label: 'Test', pageIds: [1] };
    mockPrisma.informationMenu.create.mockResolvedValue(dto);
    expect(await service.create(dto)).toEqual(dto);
  });

  it('should find all menus', async () => {
    const result = [{ id: 1, label: 'Test Menu', pageIds: [1, 2] }];
    mockPrisma.informationMenu.findMany.mockResolvedValue(result);
    expect(await service.findAll()).toEqual(result);
  });

  it('should find a menu by id with pages', async () => {
    const menu = { id: 1, label: 'Test Menu', pageIds: [1, 2] };
    const pages = [{ id: 1 }, { id: 2 }];
    mockPrisma.informationMenu.findUnique.mockResolvedValue(menu);
    mockPrisma.informationPage.findMany.mockResolvedValue(pages);
    expect(await service.findById(1)).toEqual({ ...menu, pages });
  });

  it('should update a menu', async () => {
    const dto = { label: 'Updated', pageIds: [2] };
    mockPrisma.informationMenu.update.mockResolvedValue(dto);
    expect(await service.update(1, dto)).toEqual(dto);
  });

  it('should delete a menu', async () => {
    const result = { id: 1 };
    mockPrisma.informationMenu.delete.mockResolvedValue(result);
    expect(await service.delete(1)).toEqual(result);
  });
});
