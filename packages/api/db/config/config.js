const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
        timestamps: true,
        paranoid: false,
        underscored: true,
        freezeTableName: false,
    },
};
