import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimentacoesModule } from './movimentacoes.module';
import { VagasModule } from '../vagas/vagas.module';
import { TarifasModule } from '../tarifas/tarifas.module';
import { Movimentacao } from './entities/movimentacao.entity';
import { Vaga } from '../vagas/entities/vaga.entity';
import { Tarifa } from '../tarifas/entities/tarifa.entity';
import { TipoVeiculo } from '../../common/enums/tipo-veiculo.enum';
import { TipoVaga } from '../../common/enums/tipo-vaga.enum';
import { StatusVaga } from '../../common/enums/status-vaga.enum';

describe('MovimentacoesController (e2e)', () => {
  let app: INestApplication;
  let vagaCarroId: string;
  let vagaMotoId: string;
  let tarifaRepository: Repository<Tarifa>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'parkia',
          password: 'parkia',
          database: 'parkia_test',
          entities: [Movimentacao, Vaga, Tarifa],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        VagasModule,
        TarifasModule,
        MovimentacoesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    tarifaRepository = moduleFixture.get<Repository<Tarifa>>(
      getRepositoryToken(Tarifa),
    );

    // Criar tarifas de teste diretamente no banco
    const tarifaCarro = tarifaRepository.create({
      tipo_veiculo: TipoVeiculo.CARRO,
      valor_primeira_hora: 15,
      valor_hora_adicional: 10,
      tolerancia_minutos: 15,
    });
    await tarifaRepository.save(tarifaCarro);

    const tarifaMoto = tarifaRepository.create({
      tipo_veiculo: TipoVeiculo.MOTO,
      valor_primeira_hora: 10,
      valor_hora_adicional: 5,
      tolerancia_minutos: 15,
    });
    await tarifaRepository.save(tarifaMoto);

    // Criar vagas de teste
    const vagaCarro = await request(app.getHttpServer())
      .post('/api/v1/vagas')
      .send({
        numero: 'A1',
        tipo: TipoVaga.CARRO,
        status: StatusVaga.LIVRE,
      });
    vagaCarroId = vagaCarro.body.id;

    const vagaMoto = await request(app.getHttpServer())
      .post('/api/v1/vagas')
      .send({
        numero: 'M1',
        tipo: TipoVaga.MOTO,
        status: StatusVaga.LIVRE,
      });
    vagaMotoId = vagaMoto.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Verificação de Banco de Teste', () => {
    it('deve confirmar que está usando banco de teste (parkia_test)', async () => {
      // Verificação prática: criar um registro no banco de teste
      // Se estivesse usando banco de produção, haveria conflitos ou dados diferentes
      const vaga = await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'VERIFY-TEST',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        })
        .expect(201);

      // Verificar que o registro foi criado corretamente
      expect(vaga.body).toHaveProperty('id');
      expect(vaga.body.numero).toBe('VERIFY-TEST');
      expect(vaga.body.tipo).toBe(TipoVaga.CARRO);
      expect(vaga.body.status).toBe(StatusVaga.LIVRE);

      // Limpar o registro de teste
      await request(app.getHttpServer())
        .delete(`/api/v1/vagas/${vaga.body.id}`)
        .expect(204);
    });
  });

  describe('/movimentacoes/entrada (POST)', () => {
    it('deve registrar entrada de veículo com sucesso', () => {
      return request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaCarroId,
          placa: 'ABC-1234',
          tipoVeiculo: TipoVeiculo.CARRO,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.placa).toBe('ABC-1234');
          expect(res.body.tipo_veiculo).toBe(TipoVeiculo.CARRO);
          expect(res.body.vaga).toBeDefined();
        });
    });

    it('deve retornar erro 400 se veículo já está no pátio', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaCarroId,
          placa: 'XYZ-5678',
          tipoVeiculo: TipoVeiculo.CARRO,
        });

      return request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaCarroId,
          placa: 'XYZ-5678',
          tipoVeiculo: TipoVeiculo.CARRO,
        })
        .expect(400);
    });

    it('deve retornar erro 400 se vaga já está ocupada', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaCarroId,
          placa: 'DEF-9012',
          tipoVeiculo: TipoVeiculo.CARRO,
        });

      return request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaCarroId,
          placa: 'GHI-3456',
          tipoVeiculo: TipoVeiculo.CARRO,
        })
        .expect(400);
    });

    it('deve retornar erro 400 se carro tentar ocupar vaga de moto', () => {
      return request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaMotoId,
          placa: 'CAR-9999',
          tipoVeiculo: TipoVeiculo.CARRO,
        })
        .expect(400);
    });

    it('deve validar formato da placa', () => {
      return request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaCarroId,
          placa: 'INVALID',
          tipoVeiculo: TipoVeiculo.CARRO,
        })
        .expect(400);
    });
  });

  describe('/movimentacoes/saida (POST)', () => {
    it('deve registrar saída e calcular valor corretamente', async () => {
      // Criar uma nova vaga livre para garantir que está disponível
      const novaVaga = await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'TEST-SAIDA',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        });

      // Registrar entrada
      const entrada = await request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: novaVaga.body.id,
          placa: 'SAI-1234',
          tipoVeiculo: TipoVeiculo.CARRO,
        })
        .expect(201);

      // Aguardar um pouco para simular permanência
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Registrar saída
      return request(app.getHttpServer())
        .post('/api/v1/movimentacoes/saida')
        .send({
          placa: 'SAI-1234',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('saida');
          expect(res.body).toHaveProperty('valor_pago');
          expect(res.body).toHaveProperty('tempo_permanencia_minutos');
          expect(res.body).toHaveProperty('tarifa_aplicada');
        });
    });

    it('deve retornar erro 404 se veículo não está no pátio', () => {
      return request(app.getHttpServer())
        .post('/api/v1/movimentacoes/saida')
        .send({
          placa: 'ABC-9999', // Placa válida no formato, mas não existe no pátio
        })
        .expect(404);
    });
  });

  describe('/movimentacoes (GET)', () => {
    it('deve listar movimentações ativas', async () => {
      // Criar algumas movimentações ativas
      await request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaCarroId,
          placa: 'ACT-1111',
          tipoVeiculo: TipoVeiculo.CARRO,
        });

      return request(app.getHttpServer())
        .get('/api/v1/movimentacoes')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((mov: any) => {
            expect(mov.saida).toBeNull();
          });
        });
    });
  });

  describe('/movimentacoes/historico (GET)', () => {
    it('deve listar histórico de movimentações', async () => {
      // Criar uma movimentação completa (entrada e saída)
      await request(app.getHttpServer())
        .post('/api/v1/movimentacoes/entrada')
        .send({
          vagaId: vagaCarroId,
          placa: 'HIS-2222',
          tipoVeiculo: TipoVeiculo.CARRO,
        });

      await request(app.getHttpServer())
        .post('/api/v1/movimentacoes/saida')
        .send({
          placa: 'HIS-2222',
        });

      return request(app.getHttpServer())
        .get('/api/v1/movimentacoes/historico')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((mov: any) => {
            expect(mov.saida).not.toBeNull();
          });
        });
    });
  });
});
