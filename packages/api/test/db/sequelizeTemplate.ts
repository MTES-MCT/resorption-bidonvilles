import { Sequelize, Options } from 'sequelize';
import config from '#db/config/config';

const typedConfig: Options = {
    ...config,
    database: 'resorption_bidonvilles_tests_template',
    dialect: 'postgres',
};

export const sequelize: Sequelize = new Sequelize(
    'resorption_bidonvilles_tests_template',
    typedConfig.username,
    typedConfig.password,
    typedConfig,
);

export default sequelize;
