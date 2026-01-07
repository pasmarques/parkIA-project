import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusVaga } from '../../../common/enums/status-vaga.enum';
import { TipoVaga } from '../../../common/enums/tipo-vaga.enum';

@Entity('vagas')
export class Vaga {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  numero!: string;

  @Column({ type: 'enum', enum: StatusVaga })
  status!: StatusVaga;

  @Column({ type: 'enum', enum: TipoVaga })
  tipo!: TipoVaga;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
