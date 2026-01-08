import {
  Body,
  Controller,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { TarifasService } from './tarifas.service';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { Tarifa } from './entities/tarifa.entity';

@ApiTags('Tarifas')
@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarifas de estacionamento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarifas',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440100',
          tipo_veiculo: 'carro',
          valor_primeira_hora: 15.0,
          valor_hora_adicional: 10.0,
          tolerancia_minutos: 15,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440101',
          tipo_veiculo: 'moto',
          valor_primeira_hora: 10.0,
          valor_hora_adicional: 5.0,
          tolerancia_minutos: 15,
        },
      ],
    },
  })
  async findAll(): Promise<Tarifa[]> {
    return this.tarifasService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma tarifa' })
  @ApiBody({
    schema: {
      example: {
        valor_primeira_hora: 18.0,
        valor_hora_adicional: 12.0,
        tolerancia_minutos: 20,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tarifa atualizada',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440100',
        tipo_veiculo: 'carro',
        valor_primeira_hora: 18.0,
        valor_hora_adicional: 12.0,
        tolerancia_minutos: 20,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Tarifa não encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateTarifaDto): Promise<Tarifa> {
    return this.tarifasService.update(id, dto);
  }
}
