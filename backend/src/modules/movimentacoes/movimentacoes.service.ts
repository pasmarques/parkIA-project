import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimentacao } from './entities/movimentacao.entity';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';

@Injectable()
export class MovimentacoesService {
  constructor(
    @InjectRepository(Movimentacao)
    private readonly movimentacaoRepository: Repository<Movimentacao>,
  ) {}

  async registrarEntrada(dto: CreateMovimentacaoDto) {
    //TODO: Implementar lógica de registro de entrada com o repositório
    return {
      message: 'Entrada registrada (mock)',
      data: dto,
    };
  }
}
