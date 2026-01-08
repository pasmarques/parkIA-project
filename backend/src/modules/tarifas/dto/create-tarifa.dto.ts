import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoVeiculo } from '../../../common/enums/tipo-veiculo.enum';

export class CreateTarifaDto {
  @IsNotEmpty()
  @IsEnum(TipoVeiculo)
  tipo_veiculo!: TipoVeiculo;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  valor_primeira_hora!: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  valor_hora_adicional!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  tolerancia_minutos?: number;
}
