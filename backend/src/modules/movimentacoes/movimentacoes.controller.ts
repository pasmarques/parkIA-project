import { Controller, Post, Get, Body, Query, HttpCode } from '@nestjs/common';
import { MovimentacoesService } from './movimentacoes.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { RegistrarSaidaDto } from './dto/registrar-saida.dto';
import { HistoricoFilterDto } from './dto/historico-filter.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Movimentações')
@Controller('movimentacoes')
export class MovimentacoesController {
  constructor(
    private readonly movimentacoesService: MovimentacoesService,
  ) {}

  @Post('entrada')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar entrada de veículo' })
  @ApiResponse({ status: 201, description: 'Entrada registrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro de validação ou regra de negócio' })
  @ApiResponse({ status: 404, description: 'Vaga não encontrada' })
  registrarEntrada(@Body() dto: CreateMovimentacaoDto) {
    return this.movimentacoesService.registrarEntrada(dto);
  }

  @Post('saida')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar saída de veículo e calcular valor' })
  @ApiResponse({ status: 201, description: 'Saída registrada e valor calculado' })
  @ApiResponse({ status: 404, description: 'Movimentação ativa não encontrada' })
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

