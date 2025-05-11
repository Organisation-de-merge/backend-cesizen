
import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageService } from './page.service';

describe('PageController', () => {
  let controller: PageController;
  let service: PageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageController],
      providers: [
        {
          provide: PageService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findLatest: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PageController>(PageController);
    service = module.get<PageService>(PageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service to find all pages', () => {
    controller.findAll('PUBLISHED', 1, undefined, undefined);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service to find latest pages', () => {
    controller.findLatest('5');
    expect(service.findLatest).toHaveBeenCalled();
  });

  it('should call service to find page by ID', () => {
    controller.findById(1);
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('should call service to delete page', () => {
    controller.delete(1);
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
