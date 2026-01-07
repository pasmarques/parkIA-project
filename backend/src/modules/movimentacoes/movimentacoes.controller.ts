import { Controller, Post, Body } from '@nestjs/common';
import { MovimentacoesService } from './movimentacoes.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
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
}

