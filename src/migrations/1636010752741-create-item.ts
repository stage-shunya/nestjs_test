import {MigrationInterface, QueryRunner} from "typeorm";

export class createItem1636010752741 implements MigrationInterface {
    name = 'createItem1636010752741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "item" ("id" SERIAL NOT NULL, "todo" character varying NOT NULL, "limit" TIMESTAMP NOT NULL, "idDone" boolean NOT NULL DEFAULT false, "deletePassword" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "item"`);
    }

}
