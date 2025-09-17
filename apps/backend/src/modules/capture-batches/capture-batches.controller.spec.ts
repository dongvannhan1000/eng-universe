import { Test, TestingModule } from '@nestjs/testing';
import { CaptureBatchesController } from './capture-batches.controller';
import { CaptureBatchesService } from './capture-batches.service';

describe('CaptureBatchesController', () => {
  let controller: CaptureBatchesController;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as CaptureBatchesService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaptureBatchesController],
      providers: [{ provide: CaptureBatchesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<CaptureBatchesController>(CaptureBatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
