import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TipoVeiculo } from '../../../common/enums/tipo-veiculo.enum';
import { ColumnNumericTransformer } from '../../../common/transformers/numeric.transformer';

@Entity('tarifas')
export class Tarifa {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: TipoVeiculo })
  tipo_veiculo!: TipoVeiculo;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  valor_primeira_hora!: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  valor_hora_adicional!: number;

  @Column({ default: 15 })
  tolerancia_minutos!: number;
}
