require('dotenv').config();
require("reflect-metadata");
const { DataSource } = require("typeorm");

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error('Missing database credentials in .env');
}

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [
        'src/modules/**/entities/*{.entity.js,.entity.ts}',
    ],
    migrations: [
        'src/modules/**/migrations/*{.js,.ts}',
    ],
    subscribers: [],
    ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false,
});

module.exports = { AppDataSource };
