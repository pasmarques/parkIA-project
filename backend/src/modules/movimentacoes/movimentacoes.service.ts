import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Movimentacao } from './entities/movimentacao.entity';
import { Vaga } from '../vagas/entities/vaga.entity';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { RegistrarSaidaDto } from './dto/registrar-saida.dto';
import { StatusVaga } from '../../common/enums/status-vaga.enum';
import { TipoVaga } from '../../common/enums/tipo-vaga.enum';
import { TipoVeiculo } from '../../common/enums/tipo-veiculo.enum';
import { TarifasService } from '../tarifas/tarifas.service';

@Injectable()
export class MovimentacoesService {
  constructor(
    @InjectRepository(Movimentacao)
    private readonly movimentacaoRepository: Repository<Movimentacao>,

    @InjectRepository(Vaga)
    private readonly vagaRepository: Repository<Vaga>,

    private readonly tarifasService: TarifasService,
  ) {}

  async registrarEntrada(dto: CreateMovimentacaoDto) {
    
    const placaNormalizada = dto.placa.toUpperCase();

    const movimentacaoAtiva = await this.movimentacaoRepository.findOne({
      where: {
        placa: placaNormalizada,
        saida: IsNull(),
      },
      relations: ['vaga'],
    });

    if (movimentacaoAtiva) {
      throw new BadRequestException(
        `Veículo com placa ${placaNormalizada} já está no pátio (vaga ${movimentacaoAtiva.vaga.numero})`,
      );
    }

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
      placa: placaNormalizada,
      tipo_veiculo: dto.tipoVeiculo,
      entrada: new Date(),
      vaga,
    });

    await this.movimentacaoRepository.save(movimentacao);

    vaga.status = StatusVaga.OCUPADA;
    await this.vagaRepository.save(vaga);

    return movimentacao;
  }

  async registrarSaida(dto: RegistrarSaidaDto) {
    const placaNormalizada = dto.placa.toUpperCase();

    const movimentacao = await this.movimentacaoRepository.findOne({
      where: {
        placa: placaNormalizada,
        saida: IsNull(),
      },
      relations: ['vaga'],
    });

    if (!movimentacao) {
      throw new NotFoundException(
        `Nenhuma movimentação ativa encontrada para a placa ${placaNormalizada}`,
      );
    }

    const dataSaida = new Date();
    const dataEntrada = movimentacao.entrada;

    const tempoPermanenciaMinutos =
      (dataSaida.getTime() - dataEntrada.getTime()) / (1000 * 60);

    const tarifa = await this.tarifasService.findByTipoVeiculo(
      movimentacao.tipo_veiculo,
    );

    let valorPago = 0;
    if (tempoPermanenciaMinutos > tarifa.tolerancia_minutos) {
      const minutosAposTolerancia =
        tempoPermanenciaMinutos - tarifa.tolerancia_minutos;

      valorPago = Number(tarifa.valor_primeira_hora);

      if (minutosAposTolerancia > 60) {
        const horasAdicionais = Math.ceil((minutosAposTolerancia - 60) / 60);
        valorPago += horasAdicionais * Number(tarifa.valor_hora_adicional);
      }
    }

    movimentacao.saida = dataSaida;
    movimentacao.valor_pago = valorPago;
    await this.movimentacaoRepository.save(movimentacao);

    movimentacao.vaga.status = StatusVaga.LIVRE;
    await this.vagaRepository.save(movimentacao.vaga);

    return {
      ...movimentacao,
      tempo_permanencia_minutos: Math.round(tempoPermanenciaMinutos),
      tarifa_aplicada: {
        tipo_veiculo: tarifa.tipo_veiculo,
        valor_primeira_hora: tarifa.valor_primeira_hora,
        valor_hora_adicional: tarifa.valor_hora_adicional,
        tolerancia_minutos: tarifa.tolerancia_minutos,
      },
    };
  }

  async listarAtivas() {
    return this.movimentacaoRepository.find({
      where: {
        saida: IsNull(),
      },
      relations: ['vaga'],
      order: {
        entrada: 'DESC',
      },
    });
  }

  async listarHistorico(dataInicio?: Date, dataFim?: Date) {
    const queryBuilder = this.movimentacaoRepository
      .createQueryBuilder('movimentacao')
      .leftJoinAndSelect('movimentacao.vaga', 'vaga')
      .where('movimentacao.saida IS NOT NULL');

    if (dataInicio) {
      queryBuilder.andWhere('movimentacao.saida >= :dataInicio', {
        dataInicio,
      });
    }

    if (dataFim) {
      const dataFimAjustada = new Date(dataFim);
      dataFimAjustada.setDate(dataFimAjustada.getDate() + 1);
      queryBuilder.andWhere('movimentacao.saida < :dataFim', {
        dataFim: dataFimAjustada,
      });
    }

    queryBuilder.orderBy('movimentacao.saida', 'DESC');

    return queryBuilder.getMany();
  }
}
