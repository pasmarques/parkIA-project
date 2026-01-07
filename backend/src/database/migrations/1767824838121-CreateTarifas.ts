import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTarifas1767824838121 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tarifas',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tipo_veiculo',
            type: 'varchar',
          },
          {
            name: 'valor_primeira_hora',
            type: 'decimal',
          },
          {
            name: 'valor_hora_adicional',
            type: 'decimal',
          },
          {
            name: 'tolerancia_minutos',
            type: 'int',
            default: 15,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tarifas');
  }

}
