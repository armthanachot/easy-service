import { Module } from '@nestjs/common'
import { ReserveTableService } from './reserve-table.service'
import { ReserveTableController } from './reserve-table.controller'
import { ReserveTableModel } from './reserve-table.model'

@Module({
  controllers: [ReserveTableController],
  providers: [ReserveTableService, ReserveTableModel]
})
export class ReserveTableModule {}
