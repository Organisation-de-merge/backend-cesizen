import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  const mockService = {
    create: jest.fn().mockResolvedValue({ id: 1, label: 'Test Menu', pageIds: [1, 2] }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, label: 'Test Menu', pageIds: [1, 2] }]),
    findById: jest.fn().mockResolvedValue({ id: 1, label: 'Test Menu', pageIds: [1, 2], pages: [] }),
    update: jest.fn().mockResolvedValue({ id: 1, label: 'Updated Menu', pageIds: [1] }),
    delete: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [{ provide: MenuService, useValue: mockService }],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
  });

  it('should create a menu', async () => {
    const dto = { label: 'Test Menu', pageIds: [1, 2] };
    expect(await controller.create(dto)).toEqual({ id: 1, label: 'Test Menu', pageIds: [1, 2] });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all menus', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, label: 'Test Menu', pageIds: [1, 2] }]);
  });

  it('should return a menu by ID', async () => {
    expect(await controller.findById(1)).toEqual({ id: 1, label: 'Test Menu', pageIds: [1, 2], pages: [] });
  });

  it('should update a menu', async () => {
    const dto = { label: 'Updated Menu', pageIds: [1] };
    expect(await controller.update(1, dto)).toEqual({ id: 1, label: 'Updated Menu', pageIds: [1] });
  });

  it('should delete a menu', async () => {
    expect(await controller.delete(1)).toEqual({ id: 1 });
  });
});
