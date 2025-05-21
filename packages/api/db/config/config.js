const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

function getConfig(database) {
    const host = database === 'majic' ? `${process.env.RB_API_MAJIC_POSTGRES_HOST}` : `${process.env.RB_API_POSTGRES_HOST}`;
    const port = database === 'majic' ? `${process.env.RB_API_MAJIC_POSTGRES_PORT}` : `${process.env.RB_API_POSTGRES_PORT}`;
    const password = database === 'majic' ? `${process.env.RB_API_MAJIC_POSTGRES_PASSWORD}` : `${process.env.RB_API_POSTGRES_PASSWORD}`;
    return {
        username: process.env.RB_API_POSTGRES_USER,
        password,
        host,
        port: parseInt(port, 10),
        database,
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
    development: getConfig(`${process.env.RB_API_POSTGRES_DB}`),
    production: getConfig(process.env.RB_API_POSTGRES_DB),
    majic: getConfig(process.env.RB_API_MAJIC_POSTGRES_DB),
    test: getConfig(`${process.env.RB_API_POSTGRES_DB}_e2e`),
};
configs.default = configs[env];

module.exports = configs;
