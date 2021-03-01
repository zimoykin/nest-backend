import {MigrationInterface, QueryRunner} from "typeorm";

export class first1614630394139 implements MigrationInterface {
    name = 'first1614630394139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" ADD "userId" uuid`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createDateTime" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."lastChangedDateTime" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "todo"."createDateTime" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "todo"."lastChangedDateTime" IS NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_1e982e43f63a98ad9918a86035c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_1e982e43f63a98ad9918a86035c"`);
        await queryRunner.query(`COMMENT ON COLUMN "todo"."lastChangedDateTime" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "todo"."createDateTime" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."lastChangedDateTime" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createDateTime" IS NULL`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "userId"`);
    }

}
