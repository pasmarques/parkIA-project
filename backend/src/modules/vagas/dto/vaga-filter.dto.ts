import { IsEnum, IsOptional } from 'class-validator';
import { TipoVaga } from '../../../common/enums/tipo-vaga.enum';
import { StatusVaga } from '../../../common/enums/status-vaga.enum';

export class VagaFilterDto {
  @IsOptional()
  @IsEnum(StatusVaga)
  status?: StatusVaga;

  @IsOptional()
  @IsEnum(TipoVaga)
  tipo?: TipoVaga;
}
