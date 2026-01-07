import { IsEnum, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { TipoVeiculo } from '../../../common/enums/tipo-veiculo.enum';

export class CreateMovimentacaoDto {
  @IsUUID()
  vagaId!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([A-Z]{3}-\d{4}|[A-Z]{3}\d[A-Z]\d{2})$/, {
    message: 'Placa inválida. Use o formato ABC-1234 ou ABC1D23',
  })
  placa!: string;

  @IsEnum(TipoVeiculo)
  tipoVeiculo!: TipoVeiculo;
}
