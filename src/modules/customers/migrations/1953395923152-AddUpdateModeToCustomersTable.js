const {MigrationInterface, QueryRunner, Table, TableColumn} = require("typeorm");

module.exports = class AddUpdateModeToCustomersTable1953395923152 {
    async up(queryRunner) {
        await queryRunner.addColumn(
            "customers",
            new TableColumn({
                name: "update_mode",
                type: "boolean",
                isNullable: false,
                default: false,
            }),
        );
    }

    async down(queryRunner) {
        await queryRunner.dropColumn("customers", "update_mode");
    }
}
