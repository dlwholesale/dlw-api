const { MigrationInterface, QueryRunner, Table, TableForeignKey } = require("typeorm");

module.exports = class CreateCustomerBalancesTable1883307200000 {
    name = 'CreateCustomerBalancesTable1883307200000';

    async up(queryRunner) {
        await queryRunner.createTable(
            new Table({
                name: "customer_balances",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "customer_id",
                        type: "int"
                    },
                    {
                        name: "account_id",
                        type: "varchar"
                    },
                    {
                        name: "account_name",
                        type: "varchar"
                    },
                    {
                        name: "account_type",
                        type: "varchar"
                    },
                    {
                        name: "available_balance",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        isNullable: true,
                        default: null
                    },
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "customer_balances",
            new TableForeignKey({
                columnNames: ["customer_id"],
                referencedTableName: "customers",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE"
            })
        );
    }

    async down(queryRunner) {
        const table = await queryRunner.getTable("customer_balances");
        const foreignKey = table.foreignKeys.find(
            fk => fk.columnNames.indexOf("customer_id") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("customer_balances", foreignKey);
        }

        await queryRunner.dropTable("customer_balances");
    }
}
