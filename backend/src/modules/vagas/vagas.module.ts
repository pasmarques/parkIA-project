import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaga } from './entities/vaga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vaga])],
})
export class VagasModule {}
