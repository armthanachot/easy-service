import { Test, TestingModule } from '@nestjs/testing';
import { ReserveTableController } from './reserve-table.controller';
import { ReserveTableService } from './reserve-table.service';

describe('ReserveTableController', () => {
  let controller: ReserveTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReserveTableController],
      providers: [ReserveTableService],
    }).compile();

    controller = module.get<ReserveTableController>(ReserveTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
