import { Test, TestingModule } from '@nestjs/testing';
import { VocabService } from './vocab.service';

describe('VocabService', () => {
  let service: VocabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabService],
    }).compile();

    service = module.get<VocabService>(VocabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
