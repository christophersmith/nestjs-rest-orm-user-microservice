import { readFileSync } from 'fs';
import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

const BASE_NAME = '1645883606752-BaseSchema';

export class BaseSchema1645883606752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      readFileSync(join(__dirname, `${BASE_NAME}.Up.sql`), 'utf-8'),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      readFileSync(join(__dirname, `${BASE_NAME}.Down.sql`), 'utf-8'),
    );
  }
}
