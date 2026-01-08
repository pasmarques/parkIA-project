import { DataSource } from 'typeorm';
import { Tarifa } from '../modules/tarifas/entities/tarifa.entity';
import { TipoVeiculo } from '../common/enums/tipo-veiculo.enum';

export async function seedTarifas(dataSource: DataSource) {
  const repo = dataSource.getRepository(Tarifa);

  const tarifas: Partial<Tarifa>[] = [
    {
      tipo_veiculo: TipoVeiculo.CARRO,
      valor_primeira_hora: 15,
      valor_hora_adicional: 10,
      tolerancia_minutos: 15,
    },
    {
      tipo_veiculo: TipoVeiculo.MOTO,
      valor_primeira_hora: 10,
      valor_hora_adicional: 5,
      tolerancia_minutos: 15,
    },
  ];

  for (const tarifa of tarifas) {
    const exists = await repo.findOne({
      where: { tipo_veiculo: tarifa.tipo_veiculo },
    });

    if (!exists) {
      await repo.save(repo.create(tarifa));
    }
  }

  console.log('Seed de tarifas concluído');
}
