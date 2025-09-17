import { Test, TestingModule } from '@nestjs/testing';
import { VocabController } from './vocab.controller';
import { VocabService } from './vocab.service';

describe('VocabController', () => {
  let controller: VocabController;

  beforeEach(async () => {
    const vocabServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      getSummary: jest.fn(),
      getReviewQueue: jest.fn(),
      review: jest.fn(),
      listReviews: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as VocabService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabController],
      providers: [{ provide: VocabService, useValue: vocabServiceMock }],
    }).compile();

    controller = module.get<VocabController>(VocabController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
