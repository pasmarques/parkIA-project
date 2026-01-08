import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimentacao } from './entities/movimentacao.entity';
import { MovimentacoesService } from './movimentacoes.service';
import { MovimentacoesController } from './movimentacoes.controller';
import { Vaga } from '../vagas/entities/vaga.entity';
import { TarifasModule } from '../tarifas/tarifas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movimentacao, Vaga]),
    TarifasModule,
  ],
  controllers: [MovimentacoesController],
  providers: [MovimentacoesService],
})
export class MovimentacoesModule {}
