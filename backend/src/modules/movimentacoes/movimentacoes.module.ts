import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimentacao } from './entities/movimentacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movimentacao])],
})
export class MovimentacoesModule {}
