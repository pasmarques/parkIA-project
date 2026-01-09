import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vaga } from '../../vagas/entities/vaga.entity';
import { TipoVeiculo } from '../../../common/enums/tipo-veiculo.enum';
import { ColumnNumericTransformer } from '../../../common/transformers/numeric.transformer';

@Entity('movimentacoes')
export class Movimentacao {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Vaga)
  @JoinColumn({ name: 'vaga_id' })
  vaga!: Vaga;

  @Column()
  placa!: string;

  @Column({ type: 'enum', enum: TipoVeiculo })
  tipo_veiculo!: TipoVeiculo;

  @Column({ type: 'timestamp' })
  entrada!: Date;

  @Column({ type: 'timestamp', nullable: true })
  saida!: Date;

  @Column({ type: 'decimal', nullable: true, transformer: new ColumnNumericTransformer() })
  valor_pago!: number;
}
