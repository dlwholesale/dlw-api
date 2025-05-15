const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "ErrorLog",
    tableName: "error_logs",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
            generationStrategy: "increment"
        },
        timestamp: {
            type: "timestamp",
            createDate: true,
            default: () => "CURRENT_TIMESTAMP"
        },
        message: {
            type: "text"
        },
        details: {
            type: "text",
            nullable: true
        }
    }
});
