const { MigrationInterface, QueryRunner, Table } = require("typeorm");

module.exports = class CreateErrorLogsTable1950000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(
            new Table({
                name: "error_logs",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "timestamp",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "message",
                        type: "text"
                    },
                    {
                        name: "details",
                        type: "text",
                        isNullable: true
                    }
                ]
            }),
            true
        );
    }

    async down(queryRunner) {
        await queryRunner.dropTable("error_logs");
    }
};
