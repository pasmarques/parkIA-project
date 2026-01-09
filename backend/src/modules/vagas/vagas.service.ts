import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Vaga } from './entities/vaga.entity';
import { Movimentacao } from '../movimentacoes/entities/movimentacao.entity';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';
import { VagaFilterDto } from './dto/vaga-filter.dto';
import { VagaEstatisticasDto } from './dto/vaga-estatisticas.dto';
import { StatusVaga } from '../../common/enums/status-vaga.enum';

@Injectable()
export class VagasService {
  constructor(
    @InjectRepository(Vaga)
    private readonly repo: Repository<Vaga>,
    @InjectRepository(Movimentacao)
    private readonly movRepo: Repository<Movimentacao>,
  ) {}

  async findAll(filter: VagaFilterDto): Promise<Vaga[]> {
    const qb = this.repo.createQueryBuilder('vaga');

    if (filter?.status) {
      qb.andWhere('vaga.status = :status', { status: filter.status });
    }

    if (filter?.tipo) {
      qb.andWhere('vaga.tipo = :tipo', { tipo: filter.tipo });
    }

    return qb.getMany();
  }

  async create(dto: CreateVagaDto): Promise<Vaga> {
    const exists = await this.repo.findOne({ where: { numero: dto.numero } });
    if (exists) {
      throw new BadRequestException('Número da vaga já existe');
    }

    const vaga = this.repo.create(dto as Partial<Vaga>);
    return this.repo.save(vaga);
  }

  async update(id: string, dto: UpdateVagaDto): Promise<Vaga> {
    const vaga = await this.repo.findOne({ where: { id } });
    if (!vaga) throw new NotFoundException('Vaga não encontrada');

    if (dto.numero && dto.numero !== vaga.numero) {
      const other = await this.repo.findOne({ where: { numero: dto.numero } });
      if (other && other.id !== id) {
        throw new BadRequestException('Número da vaga já existe');
      }
    }

    Object.assign(vaga, dto);
    return this.repo.save(vaga);
  }

  async remove(id: string): Promise<void> {
    const vaga = await this.repo.findOne({ where: { id } });
    if (!vaga) throw new NotFoundException('Vaga não encontrada');

    if (vaga.status === StatusVaga.OCUPADA) {
      throw new BadRequestException('Não é permitido excluir vaga ocupada');
    }

    const hasMovimentacoes = await this.movRepo.count({ where: { vaga: { id } } });
    if (hasMovimentacoes > 0) {
      throw new ConflictException('Não é permitido excluir vaga com movimentações registradas');
    }

    await this.repo.remove(vaga);
  }

  async estatisticas(): Promise<VagaEstatisticasDto> {
    const total = await this.repo.count();
    const ocupadas = await this.repo.count({ where: { status: StatusVaga.OCUPADA } });
    const livres = await this.repo.count({ where: { status: StatusVaga.LIVRE } });
    const manutencao = await this.repo.count({ where: { status: StatusVaga.MANUTENCAO } });

    const percentualOcupacao = total > 0 ? (ocupadas / total) * 100 : 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const movimentacoesHoje = await this.movRepo.find({
      where: {
        saida: Between(startOfDay, endOfDay)
      }
    });

    const receitaDoDia = movimentacoesHoje.reduce((acc, mov) => acc + Number(mov.valor_pago || 0), 0);

    return {
      total,
      ocupadas,
      livres,
      manutencao,
      percentualOcupacao,
      receitaDoDia,
    } as VagaEstatisticasDto;
  }
}
