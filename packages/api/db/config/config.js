const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

function getConfig(database) {
    return {
        username: process.env.RB_API_POSTGRES_USER,
        password: process.env.RB_API_POSTGRES_PASSWORD,
        host: process.env.RB_API_POSTGRES_HOST,
        port: parseInt(process.env.RB_API_POSTGRES_PORT, 10),
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
    test: getConfig(`${process.env.RB_API_POSTGRES_DB}_e2e`),
};
configs.default = configs[env];

module.exports = configs;
