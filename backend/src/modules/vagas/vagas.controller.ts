import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { VagasService } from './vagas.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';
import { VagaFilterDto } from './dto/vaga-filter.dto';
import { VagaEstatisticasDto } from './dto/vaga-estatisticas.dto';
import { Vaga } from './entities/vaga.entity';

@Controller('vagas')
export class VagasController {
  constructor(private readonly vagasService: VagasService) {}

  @Get()
  async findAll(@Query() filter: VagaFilterDto): Promise<Vaga[]> {
    return this.vagasService.findAll(filter);
  }

  @Get('estatisticas')
  async estatisticas(): Promise<VagaEstatisticasDto> {
    return this.vagasService.estatisticas();
  }

  @Post()
  async create(@Body() dto: CreateVagaDto): Promise<Vaga> {
    return this.vagasService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVagaDto): Promise<Vaga> {
    return this.vagasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return this.vagasService.remove(id);
  }
}
