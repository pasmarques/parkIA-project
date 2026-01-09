import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VagasModule } from './vagas.module';
import { Vaga } from './entities/vaga.entity';
import { Movimentacao } from '../movimentacoes/entities/movimentacao.entity';
import { TipoVaga } from '../../common/enums/tipo-vaga.enum';
import { StatusVaga } from '../../common/enums/status-vaga.enum';

describe('VagasController (e2e)', () => {
  let app: INestApplication;
  let movRepo: Repository<Movimentacao>;

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
          entities: [Vaga, Movimentacao],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        VagasModule,
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
    movRepo = moduleFixture.get(getRepositoryToken(Movimentacao));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/vagas (POST)', () => {
    it('deve criar uma nova vaga', () => {
      return request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'A1',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.numero).toBe('A1');
          expect(res.body.tipo).toBe(TipoVaga.CARRO);
          expect(res.body.status).toBe(StatusVaga.LIVRE);
        });
    });

    it('deve retornar erro 400 se número da vaga já existe', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'A2',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        });

      return request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'A2',
          tipo: TipoVaga.MOTO,
          status: StatusVaga.LIVRE,
        })
        .expect(400);
    });
  });

  describe('/vagas (GET)', () => {
    it('deve listar todas as vagas', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'B1',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        });

      return request(app.getHttpServer())
        .get('/api/v1/vagas')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('deve filtrar vagas por status', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'C1',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.OCUPADA,
        });

      return request(app.getHttpServer())
        .get('/api/v1/vagas?status=ocupada')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((vaga: any) => {
            expect(vaga.status).toBe(StatusVaga.OCUPADA);
          });
        });
    });

    it('deve filtrar vagas por tipo', () => {
      return request(app.getHttpServer())
        .get('/api/v1/vagas?tipo=moto')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((vaga: any) => {
            expect(vaga.tipo).toBe(TipoVaga.MOTO);
          });
        });
    });
  });

  describe('/vagas/estatisticas (GET)', () => {
    it('deve retornar estatísticas das vagas', async () => {
      // Criar algumas vagas para teste
      await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'D1',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        });

      await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'D2',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.OCUPADA,
        });

      return request(app.getHttpServer())
        .get('/api/v1/vagas/estatisticas')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('ocupadas');
          expect(res.body).toHaveProperty('livres');
          expect(res.body).toHaveProperty('percentualOcupacao');
          expect(typeof res.body.total).toBe('number');
          expect(typeof res.body.ocupadas).toBe('number');
          expect(typeof res.body.livres).toBe('number');
          expect(typeof res.body.percentualOcupacao).toBe('number');
        });
    });
  });

  describe('/vagas/:id (PUT)', () => {
    it('deve atualizar uma vaga', async () => {
      const vaga = await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'E1',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        });

      return request(app.getHttpServer())
        .put(`/api/v1/vagas/${vaga.body.id}`)
        .send({
          status: StatusVaga.OCUPADA,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(StatusVaga.OCUPADA);
        });
    });

    it('deve retornar erro 404 se vaga não existe', () => {
      return request(app.getHttpServer())
        .put('/api/v1/vagas/00000000-0000-0000-0000-000000000000')
        .send({
          status: StatusVaga.LIVRE,
        })
        .expect(404);
    });
  });

  describe('/vagas/:id (DELETE)', () => {
    it('deve deletar uma vaga livre', async () => {
      const vaga = await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'F1',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        });

      return request(app.getHttpServer())
        .delete(`/api/v1/vagas/${vaga.body.id}`)
        .expect(204);
    });

    it('deve retornar erro 409 se vaga tem movimentações', async () => {
      const vaga = await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'F3',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.LIVRE,
        });

      await movRepo.save({
        vaga: { id: vaga.body.id },
        placa: 'ABC-1234',
        tipo_veiculo: 'carro' as any,
        entrada: new Date(),
      });

      return request(app.getHttpServer())
        .delete(`/api/v1/vagas/${vaga.body.id}`)
        .expect(409);
    });

    it('deve retornar erro 400 se tentar deletar vaga ocupada', async () => {
      const vaga = await request(app.getHttpServer())
        .post('/api/v1/vagas')
        .send({
          numero: 'F2',
          tipo: TipoVaga.CARRO,
          status: StatusVaga.OCUPADA,
        });

      return request(app.getHttpServer())
        .delete(`/api/v1/vagas/${vaga.body.id}`)
        .expect(400);
    });

    it('deve retornar erro 404 se vaga não existe', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/vagas/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
