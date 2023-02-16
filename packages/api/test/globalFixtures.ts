import '../module_alias';
import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';

exports.mochaGlobalSetup = async () => {
    console.log('-- (Re)création de la base template');
    await sequelize.query('DROP DATABASE IF EXISTS resorption_bidonvilles_tests_template');
    await sequelize.query('CREATE DATABASE resorption_bidonvilles_tests_template TEMPLATE resorption_bidonvilles');
};

exports.mochaGlobalTeardown = async () => {
    console.log('-- Purge des bases de test');
    const response: { datname: string }[] = await sequelize.query(
        'SELECT datname FROM pg_database WHERE datname SIMILAR TO \'resorption_bidonvilles_tests_[0-9]+\'',
        {
            type: QueryTypes.SELECT,
        },
    );
    await Promise.all(
        response.map(({ datname }) => sequelize.query(`DROP DATABASE ${datname}`)),
    );
};
