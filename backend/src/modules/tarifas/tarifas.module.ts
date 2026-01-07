import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarifa } from './entities/tarifa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarifa])],
})
export class TarifasModule {}
