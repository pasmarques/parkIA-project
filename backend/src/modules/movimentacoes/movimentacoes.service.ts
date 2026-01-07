import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimentacao } from './entities/movimentacao.entity';
import { Vaga } from '../vagas/entities/vaga.entity';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { StatusVaga } from '../../common/enums/status-vaga.enum';
import { TipoVaga } from '../../common/enums/tipo-vaga.enum';
import { TipoVeiculo } from '../../common/enums/tipo-veiculo.enum';

@Injectable()
export class MovimentacoesService {
  constructor(
    @InjectRepository(Movimentacao)
    private readonly movimentacaoRepository: Repository<Movimentacao>,

    @InjectRepository(Vaga)
    private readonly vagaRepository: Repository<Vaga>,
  ) {}

  async registrarEntrada(dto: CreateMovimentacaoDto) {
    const vaga = await this.vagaRepository.findOne({
      where: { id: dto.vagaId },
    });

    if (!vaga) {
      throw new NotFoundException('Vaga não encontrada');
    }

    if (vaga.status === StatusVaga.OCUPADA) {
      throw new BadRequestException('Vaga já está ocupada');
    }

    if (vaga.status === StatusVaga.MANUTENCAO) {
      throw new BadRequestException(
        'Vaga em manutenção não pode ser utilizada',
      );
    }

    const veiculoEhMoto = dto.tipoVeiculo === TipoVeiculo.MOTO;
    const vagaEhMoto = vaga.tipo === TipoVaga.MOTO;

    if (!veiculoEhMoto && vagaEhMoto) {
      throw new BadRequestException(
        'Carro não pode ocupar vaga de moto',
      );
    }

    const movimentacao = this.movimentacaoRepository.create({
      placa: dto.placa,
      tipo_veiculo: dto.tipoVeiculo,
      entrada: new Date(),
      vaga,
    });

    await this.movimentacaoRepository.save(movimentacao);

    vaga.status = StatusVaga.OCUPADA;
    await this.vagaRepository.save(vaga);

    return movimentacao;
  }
}
