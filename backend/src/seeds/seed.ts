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
    process.exit(0);
  } catch (error) {
    console.error('Erro ao rodar seeds:', error);
    if (error instanceof Error && error.message.includes('já existe')) {
      console.log('Dados já existem, continuando...');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } finally {
    await AppDataSource.destroy();
  }
}

runSeed();
