import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifa } from './entities/tarifa.entity';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { TipoVeiculo } from '../../common/enums/tipo-veiculo.enum';

@Injectable()
export class TarifasService {
  constructor(
    @InjectRepository(Tarifa)
    private readonly repo: Repository<Tarifa>,
  ) {}

  async findAll(): Promise<Tarifa[]> {
    return this.repo.find();
  }

  async findByTipoVeiculo(tipoVeiculo: TipoVeiculo): Promise<Tarifa> {
    const tarifa = await this.repo.findOne({ where: { tipo_veiculo: tipoVeiculo } });
    if (!tarifa) {
      throw new NotFoundException(`Tarifa não encontrada para tipo de veículo: ${tipoVeiculo}`);
    }
    return tarifa;
  }

  async create(dto: CreateTarifaDto): Promise<Tarifa> {
    const exists = await this.repo.findOne({ where: { tipo_veiculo: dto.tipo_veiculo } });
    if (exists) {
      throw new BadRequestException(`Tarifa para ${dto.tipo_veiculo} já existe`);
    }

    const tarifa = this.repo.create(dto as Partial<Tarifa>);
    return this.repo.save(tarifa);
  }

  async update(id: string, dto: UpdateTarifaDto): Promise<Tarifa> {
    const tarifa = await this.repo.findOne({ where: { id } });
    if (!tarifa) throw new NotFoundException('Tarifa não encontrada');

    if (dto.tipo_veiculo && dto.tipo_veiculo !== tarifa.tipo_veiculo) {
      const other = await this.repo.findOne({ where: { tipo_veiculo: dto.tipo_veiculo } });
      if (other) {
        throw new BadRequestException(`Tarifa para ${dto.tipo_veiculo} já existe`);
      }
    }

    Object.assign(tarifa, dto);
    return this.repo.save(tarifa);
  }
}
