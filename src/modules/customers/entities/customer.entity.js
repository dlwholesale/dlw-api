const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "Customer",
    tableName: "customers",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            generationStrategy: "increment"
        },
        customerId: {
            type: "varchar",
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
            select: false
        },
        street: {
            type: "varchar",
            name: "address_street",
            nullable: true,
            select: false
        },
        street2: {
            type: "varchar",
            name: "address_street2",
            nullable: true,
            select: false
        },
        city: {
            type: "varchar",
            name: "address_city",
            nullable: true,
            select: false
        },
        region: {
            type: "varchar",
            name: "address_region",
            nullable: true,
            select: false
        },
        postalCode: {
            type: "varchar",
            name: "address_postal_code",
            nullable: true,
            select: false
        },
        country: {
            type: "varchar",
            name: "address_country",
            select: false
        },
        linked: {
            type: "boolean",
            default: false
        },
        accessToken: {
            type: "varchar",
            name: "access_token",
            nullable: true,
            select: false
        },
        balance: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
            default: 0
        },
        updatedAt: {
            type: "timestamp",
            name: "balance_updated_at",
            nullable: true,
            default: null
        },
        linkToken: {
            type: "varchar",
            name: "link_token",
            nullable: true,
            select: false
        }
    }
});
