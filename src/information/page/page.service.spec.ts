
import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PageService', () => {
  let service: PageService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PageService,
        {
          provide: PrismaService,
          useValue: {
            informationPage: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PageService>(PageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a page', async () => {
    const dto = { title: 'Test', content: 'Content', status: 'DRAFT' };
    const result = { id: 1, ...dto };
    jest.spyOn(prisma.informationPage, 'create').mockResolvedValue(result as any);
    expect(await service.create(dto as any)).toEqual(result);
  });

  it('should find a page by id', async () => {
    const result = { id: 1, title: 'Page' };
    jest.spyOn(prisma.informationPage, 'findUnique').mockResolvedValue(result as any);
    expect(await service.findById(1)).toEqual(result);
  });

  it('should update a page', async () => {
    const dto = { title: 'Updated' };
    const result = { id: 1, ...dto };
    jest.spyOn(prisma.informationPage, 'update').mockResolvedValue(result as any);
    expect(await service.update(1, dto as any)).toEqual(result);
  });

  it('should delete a page', async () => {
    const result = { id: 1 };
    jest.spyOn(prisma.informationPage, 'delete').mockResolvedValue(result as any);
    expect(await service.delete(1)).toEqual(result);
  });
});
