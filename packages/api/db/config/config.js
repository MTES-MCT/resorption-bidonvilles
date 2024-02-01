const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

function getConfig(database) {
    return {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database,
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
}

let env = 'development';
if (process.env.NODE_ENV === 'production') {
    env = 'production';
} else if (process.env.NODE_ENV === 'test') {
    env = 'test';
}

const configs = {
    development: getConfig(`${process.env.POSTGRES_DB}`),
    production: getConfig(process.env.POSTGRES_DB),
    test: getConfig(`${process.env.POSTGRES_DB}_e2e`),
};
configs.default = configs[env];

module.exports = configs;
