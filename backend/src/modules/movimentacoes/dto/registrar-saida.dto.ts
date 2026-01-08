import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarSaidaDto {
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
}