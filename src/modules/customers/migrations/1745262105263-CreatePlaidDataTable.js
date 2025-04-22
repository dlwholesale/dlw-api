const {MigrationInterface, QueryRunner, Table} = require("typeorm");

module.exports = class CreatePlaidDataTable1745262105263 {
    async up(queryRunner) {
        await queryRunner.createTable(
          new Table({
              name: "plaid_data",
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
                  }
              ]
          }),
          true
        );
    }

    async down(queryRunner) {
        await queryRunner.dropTable("plaid_data");
    }
}
