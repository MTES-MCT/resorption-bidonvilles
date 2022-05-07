const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

module.exports = {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    define: {
        timestamps: true,
        paranoid: false,
        underscored: true,
        freezeTableName: false,
    },
};
