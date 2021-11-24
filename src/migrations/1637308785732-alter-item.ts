import {MigrationInterface, QueryRunner} from "typeorm";

export class alterItem1637308785732 implements MigrationInterface {
    name = 'alterItem1637308785732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "idDone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "idDone" boolean NOT NULL DEFAULT false`);
    }

}
