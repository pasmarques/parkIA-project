import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { MovimentacoesService } from './movimentacoes.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { RegistrarSaidaDto } from './dto/registrar-saida.dto';
import { HistoricoFilterDto } from './dto/historico-filter.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Movimentações')
@Controller('movimentacoes')
export class MovimentacoesController {
  constructor(
    private readonly movimentacoesService: MovimentacoesService,
  ) {}

  @Post('entrada')
  @ApiOperation({ summary: 'Registrar entrada de veículo' })
  registrarEntrada(@Body() dto: CreateMovimentacaoDto) {
    return this.movimentacoesService.registrarEntrada(dto);
  }

  @Post('saida')
  @ApiOperation({ summary: 'Registrar saída de veículo e calcular valor' })
  registrarSaida(@Body() dto: RegistrarSaidaDto) {
    return this.movimentacoesService.registrarSaida(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar movimentações ativas (veículos no pátio)' })
  listarAtivas() {
    return this.movimentacoesService.listarAtivas();
  }

  @Get('historico')
  @ApiOperation({ summary: 'Listar histórico de movimentações com filtro por data' })
  listarHistorico(@Query() filter: HistoricoFilterDto) {
    const dataInicio = filter.dataInicio ? new Date(filter.dataInicio) : undefined;
    const dataFim = filter.dataFim ? new Date(filter.dataFim) : undefined;
    return this.movimentacoesService.listarHistorico(dataInicio, dataFim);
  }
}

