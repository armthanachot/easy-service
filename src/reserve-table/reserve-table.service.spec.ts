import { Test, TestingModule } from '@nestjs/testing';
import { ReserveTableService } from './reserve-table.service';

describe('ReserveTableService', () => {
  let service: ReserveTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReserveTableService],
    }).compile();

    service = module.get<ReserveTableService>(ReserveTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
