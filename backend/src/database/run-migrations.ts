import 'reflect-metadata';
import { AppDataSource } from './data-source';

async function runMigrations() {
  try {
    console.log('Inicializando DataSource para migrações...');
    await AppDataSource.initialize();
    console.log('DataSource inicializado.');

    console.log('Executando migrações pendentes...');
    const migrations = await AppDataSource.runMigrations();
    console.log(`Foram executadas ${migrations.length} migrações.`);

    await AppDataSource.destroy();
    console.log('Migrações concluídas.');
    process.exit(0);
  } catch (error) {
    console.error('Erro fatal ao rodar migrações:', error);
    process.exit(1);
  }
}

runMigrations();
