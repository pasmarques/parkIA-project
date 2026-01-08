import 'reflect-metadata';
import { AppDataSource } from '../database/data-source';
import { seedVagas } from './vagas.seed';
import { seedTarifas } from './tarifas.seed';

async function runSeed() {
  try {
    console.log('Conectando no banco...');
    await AppDataSource.initialize();

    console.log('Rodando seeds...');
    await seedVagas(AppDataSource);
    await seedTarifas(AppDataSource);

    console.log('Seeds finalizados com sucesso');
  } catch (error) {
    console.error('Erro ao rodar seeds:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeed();
