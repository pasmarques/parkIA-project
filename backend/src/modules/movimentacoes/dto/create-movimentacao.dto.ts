import { IsEnum, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoVeiculo } from '../../../common/enums/tipo-veiculo.enum';

export class CreateMovimentacaoDto {
  @ApiProperty({
    description: 'ID da vaga onde o veículo está entrando',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  vagaId!: string;

  @ApiProperty({
    description: 'Placa do veículo (formato ABC-1234 ou ABC1D23)',
    example: 'ABC-1234',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([A-Z]{3}-\d{4}|[A-Z]{3}\d[A-Z]\d{2})$/, {
    message: 'Placa inválida. Use o formato ABC-1234 ou ABC1D23',
  })
  placa!: string;

  @ApiProperty({
    description: 'Tipo de veículo',
    enum: TipoVeiculo,
    example: TipoVeiculo.CARRO,
  })
  @IsEnum(TipoVeiculo)
  tipoVeiculo!: TipoVeiculo;
}
