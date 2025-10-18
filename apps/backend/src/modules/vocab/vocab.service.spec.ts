import { Test, TestingModule } from '@nestjs/testing';
import { ActiveUserService } from '../../common/active-user.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { VocabService } from './vocab.service';

describe('VocabService', () => {
  let service: VocabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocabService,
        {
          provide: PrismaService,
          useValue: {
            vocab: {},
            vocabReview: {},
            captureBatch: {},
            $transaction: () => Promise.resolve([]),
          },
        },
        {
          provide: ActiveUserService,
          useValue: { getUserId: () => 1 },
        },
      ],
    }).compile();

    service = module.get<VocabService>(VocabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
