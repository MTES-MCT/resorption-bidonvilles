import { Sequelize, Options } from 'sequelize';
import config from './config/config';

const typedConfig: Options = {
    ...config.majic,
    dialect: 'postgres',
};

export const sequelize: Sequelize = new Sequelize(
    typedConfig.database,
    typedConfig.username,
    typedConfig.password,
    typedConfig,
);

export default sequelize;
