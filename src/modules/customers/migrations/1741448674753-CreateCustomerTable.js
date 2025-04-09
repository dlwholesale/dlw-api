const {MigrationInterface, QueryRunner, Table} = require("typeorm");

module.exports = class CreateCustomerTable1741448674753 {
    async up(queryRunner) {
        await queryRunner.createTable(
            new Table({
                name: "customers",
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
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "business_name",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "address_street",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "address_street2",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "address_city",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "address_region",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "address_postal_code",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "address_country",
                        type: "varchar",
                        default: "'US'"
                    },
                    {
                        name: "linked",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "access_token",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "balance",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                        default: 0
                    },
                    {
                        name: "balance_updated_at",
                        type: "timestamp",
                        isNullable: true,
                        default: null
                    },
                    {
                        name: "link_token",
                        type: "varchar",
                        isNullable: true,
                    }
                ]
            }),
            true
        );
    }

    async down(queryRunner) {
        await queryRunner.dropTable("customers");
    }
}
