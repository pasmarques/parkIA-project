import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TipoVeiculo } from '../../../common/enums/tipo-veiculo.enum';

@Entity('tarifas')
export class Tarifa {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: TipoVeiculo })
  tipo_veiculo!: TipoVeiculo;

  @Column('decimal')
  valor_primeira_hora!: number;

  @Column('decimal')
  valor_hora_adicional!: number;

  @Column({ default: 15 })
  tolerancia_minutos!: number;
}
