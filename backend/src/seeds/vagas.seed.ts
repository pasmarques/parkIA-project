import { DataSource } from 'typeorm';
import { Vaga } from '../modules/vagas/entities/vaga.entity';
import { StatusVaga } from '../common/enums/status-vaga.enum';
import { TipoVaga } from '../common/enums/tipo-vaga.enum';

export async function seedVagas(dataSource: DataSource) {
  const repo = dataSource.getRepository(Vaga);

  const vagas: Partial<Vaga>[] = [
    { numero: 'A1', tipo: TipoVaga.CARRO, status: StatusVaga.LIVRE },
    { numero: 'A2', tipo: TipoVaga.CARRO, status: StatusVaga.LIVRE },
    { numero: 'M1', tipo: TipoVaga.MOTO, status: StatusVaga.LIVRE },
    { numero: 'M2', tipo: TipoVaga.MOTO, status: StatusVaga.LIVRE },
  ];

  for (const vaga of vagas) {
    const exists = await repo.findOne({ where: { numero: vaga.numero } });

    if (!exists) {
      await repo.save(repo.create(vaga));
    }
  }

  console.log('Seed de vagas concluído');
}
