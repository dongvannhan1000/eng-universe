import { Test, TestingModule } from '@nestjs/testing';
import { ActiveUserService } from '../../common/active-user.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CaptureBatchesService } from './capture-batches.service';

describe('CaptureBatchesService', () => {
  let service: CaptureBatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaptureBatchesService,
        {
          provide: PrismaService,
          useValue: {
            captureBatch: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: ActiveUserService,
          useValue: { getUserId: () => 1 },
        },
      ],
    }).compile();

    service = module.get<CaptureBatchesService>(CaptureBatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
