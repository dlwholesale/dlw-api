const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "PlaidData",
    tableName: "plaid_data",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            generationStrategy: "increment"
        },
        customerId: {
            type: "int",
            name: "customer_id",
            unique: true
        },
        name: {
            type: "varchar"
        },
        email: {
            type: "varchar",
            unique: true
        },
        phone: {
            type: "varchar",
        },
        street: {
            type: "varchar",
            name: "address_street",
            nullable: true,
        },
        street2: {
            type: "varchar",
            name: "address_street2",
            nullable: true,
        },
        city: {
            type: "varchar",
            name: "address_city",
            nullable: true,
        },
        region: {
            type: "varchar",
            name: "address_region",
            nullable: true,
        },
        postalCode: {
            type: "varchar",
            name: "address_postal_code",
            nullable: true,
        },
        country: {
            type: "varchar",
            name: "address_country",
        },
    },
    relations: {
        customer: {
            type: "one-to-one",
            target: "Customer",
            joinColumn: {
                name: "customer_id",
                referencedColumnName: "id"
            },
            cascade: ["insert", "update"]
        }
    }
});
