import { Sequelize, Options } from 'sequelize';
import config from '#db/config/config';

let db: Sequelize = null;

export default (): Sequelize => {
    if (db !== null || !process.env.DB_NAME) {
        return db;
    }

    const typedConfig: Options = {
        ...config,
        database: process.env.DB_NAME,
        dialect: 'postgres',
    };
    db = new Sequelize(
        process.env.DB_NAME,
        typedConfig.username,
        typedConfig.password,
        typedConfig,
    );

    return db;
};
