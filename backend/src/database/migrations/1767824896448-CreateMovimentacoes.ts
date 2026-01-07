import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMovimentacoes1767824896448 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'movimentacoes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vaga_id',
            type: 'uuid',
          },
          {
            name: 'placa',
            type: 'varchar',
          },
          {
            name: 'tipo_veiculo',
            type: 'varchar',
          },
          {
            name: 'entrada',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'saida',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'valor_pago',
            type: 'decimal',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'movimentacoes',
      new TableForeignKey({
        columnNames: ['vaga_id'],
        referencedTableName: 'vagas',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('movimentacoes');
  }

}
