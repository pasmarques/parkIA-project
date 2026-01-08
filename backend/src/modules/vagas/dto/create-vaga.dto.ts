import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TipoVaga } from '../../../common/enums/tipo-vaga.enum';
import { StatusVaga } from '../../../common/enums/status-vaga.enum';

export class CreateVagaDto {
  @IsNotEmpty()
  @IsString()
  numero!: string;

  @IsNotEmpty()
  @IsEnum(TipoVaga)
  tipo!: TipoVaga;

  @IsNotEmpty()
  @IsEnum(StatusVaga)
  status!: StatusVaga;
}
