import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VagasService } from './vagas.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';
import { VagaFilterDto } from './dto/vaga-filter.dto';
import { VagaEstatisticasDto } from './dto/vaga-estatisticas.dto';
import { Vaga } from './entities/vaga.entity';

@ApiTags('Vagas')
@Controller('vagas')
export class VagasController {
  constructor(private readonly vagasService: VagasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar vagas (opcionalmente filtrando por status e tipo)' })
  @ApiQuery({ name: 'status', required: false, schema: { enum: ['livre', 'ocupada', 'manutencao'] }, description: 'Filtrar por status' })
  @ApiQuery({ name: 'tipo', required: false, schema: { enum: ['carro', 'moto', 'deficiente'] }, description: 'Filtrar por tipo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vagas',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          numero: 'A1',
          tipo: 'carro',
          status: 'livre',
          created_at: '2026-01-08T10:00:00.000Z',
          updated_at: '2026-01-08T10:00:00.000Z',
        },
      ],
    },
  })
  async findAll(@Query() filter: VagaFilterDto): Promise<Vaga[]> {
    return this.vagasService.findAll(filter);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Retornar estatísticas de ocupação das vagas' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas de vagas',
    schema: {
      example: {
        total: 10,
        ocupadas: 3,
        livres: 7,
        percentualOcupacao: 30,
      },
    },
  })
  async estatisticas(): Promise<VagaEstatisticasDto> {
    return this.vagasService.estatisticas();
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova vaga' })
  @ApiBody({
    schema: {
      example: {
        numero: 'B12',
        tipo: 'moto',
        status: 'livre',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Vaga criada',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        numero: 'B12',
        tipo: 'moto',
        status: 'livre',
        created_at: '2026-01-08T10:00:00.000Z',
        updated_at: '2026-01-08T10:00:00.000Z',
      },
    },
  })
  async create(@Body() dto: CreateVagaDto): Promise<Vaga> {
    return this.vagasService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma vaga' })
  @ApiBody({
    schema: {
      example: {
        numero: 'B12',
        tipo: 'carro',
        status: 'ocupada',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Vaga atualizada',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        numero: 'B12',
        tipo: 'carro',
        status: 'ocupada',
        created_at: '2026-01-08T10:00:00.000Z',
        updated_at: '2026-01-08T12:00:00.000Z',
      },
    },
  })
  async update(@Param('id') id: string, @Body() dto: UpdateVagaDto): Promise<Vaga> {
    return this.vagasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover vaga (não permitido se ocupada)' })
  @ApiResponse({ status: 204, description: 'Vaga removida com sucesso' })
  @ApiResponse({ status: 400, description: 'Não é permitido excluir vaga ocupada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.vagasService.remove(id);
  }
}
