import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TarifasModule } from './tarifas.module';
import { Tarifa } from './entities/tarifa.entity';
import { TipoVeiculo } from '../../common/enums/tipo-veiculo.enum';

describe('TarifasController (e2e)', () => {
  let app: INestApplication;
  let tarifaRepository: Repository<Tarifa>;
  let tarifaCarroId: string;
  let tarifaMotoId: string;

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
          entities: [Tarifa],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        TarifasModule,
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
    const savedCarro = await tarifaRepository.save(tarifaCarro);
    tarifaCarroId = savedCarro.id;

    const tarifaMoto = tarifaRepository.create({
      tipo_veiculo: TipoVeiculo.MOTO,
      valor_primeira_hora: 10,
      valor_hora_adicional: 5,
      tolerancia_minutos: 15,
    });
    const savedMoto = await tarifaRepository.save(tarifaMoto);
    tarifaMotoId = savedMoto.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tarifas (GET)', () => {
    it('deve listar todas as tarifas', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tarifas')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
          expect(res.body.some((t: Tarifa) => t.tipo_veiculo === TipoVeiculo.CARRO)).toBe(true);
          expect(res.body.some((t: Tarifa) => t.tipo_veiculo === TipoVeiculo.MOTO)).toBe(true);
        });
    });

    it('deve retornar tarifas com estrutura correta', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tarifas')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            const tarifa = res.body[0];
            expect(tarifa).toHaveProperty('id');
            expect(tarifa).toHaveProperty('tipo_veiculo');
            expect(tarifa).toHaveProperty('valor_primeira_hora');
            expect(tarifa).toHaveProperty('valor_hora_adicional');
            expect(tarifa).toHaveProperty('tolerancia_minutos');
          }
        });
    });
  });

  describe('/tarifas/:id (PUT)', () => {
    it('deve atualizar uma tarifa', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/tarifas/${tarifaCarroId}`)
        .send({
          valor_primeira_hora: 18,
          valor_hora_adicional: 12,
          tolerancia_minutos: 20,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(tarifaCarroId);
          expect(res.body.valor_primeira_hora).toBe(18);
          expect(res.body.valor_hora_adicional).toBe(12);
          expect(res.body.tolerancia_minutos).toBe(20);
        });
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      // Primeiro, atualizar para valores conhecidos
      await request(app.getHttpServer())
        .put(`/api/v1/tarifas/${tarifaMotoId}`)
        .send({
          valor_primeira_hora: 12,
          valor_hora_adicional: 7,
        });

      // Depois, atualizar apenas um campo
      return request(app.getHttpServer())
        .put(`/api/v1/tarifas/${tarifaMotoId}`)
        .send({
          valor_primeira_hora: 15,
        })
        .expect(200)
        .expect((res) => {
          expect(Number(res.body.valor_primeira_hora)).toBe(15);
          expect(Number(res.body.valor_hora_adicional)).toBe(7); // Deve manter o valor anterior
        });
    });

    it('deve retornar erro 404 se tarifa não existe', () => {
      return request(app.getHttpServer())
        .put('/api/v1/tarifas/00000000-0000-0000-0000-000000000000')
        .send({
          valor_primeira_hora: 20,
        })
        .expect(404);
    });

    it('deve validar valores negativos', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/tarifas/${tarifaCarroId}`)
        .send({
          valor_primeira_hora: -10,
        })
        .expect(400);
    });
  });
});
