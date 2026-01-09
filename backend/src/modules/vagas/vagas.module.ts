import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaga } from './entities/vaga.entity';
import { Movimentacao } from '../movimentacoes/entities/movimentacao.entity';
import { VagasService } from './vagas.service';
import { VagasController } from './vagas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vaga, Movimentacao])],
  providers: [VagasService],
  controllers: [VagasController],
})
export class VagasModule {}
