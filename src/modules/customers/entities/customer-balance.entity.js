const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "CustomerBalance",
    tableName: "customer_balances",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            generationStrategy: "increment"
        },
        accountId: {
            type: "varchar",
            name: "account_id"
        },
        accountName: {
            type: "varchar",
            name: "account_name"
        },
        accountType: {
            type: "varchar",
            name: "account_type"
        },
        availableBalance: {
            type: "decimal",
            name: "available_balance",
            precision: 10,
            scale: 2,
            nullable: true
        },
        updatedAt: {
            type: "timestamp",
            name: "updated_at",
            nullable: true,
            default: null
        }
    },
    relations: {
        customer: {
            type: "many-to-one",
            target: "Customer",
            joinColumn: {
                name: "customer_id"
            },
            onDelete: "CASCADE"
        }
    }
});
