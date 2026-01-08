import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { MovimentacoesModule } from './modules/movimentacoes/movimentacoes.module';
import { TarifasModule } from './modules/tarifas/tarifas.module';
import { VagasModule } from './modules/vagas/vagas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    VagasModule,
    TarifasModule,
    MovimentacoesModule,
  ],
})
export class AppModule {}
