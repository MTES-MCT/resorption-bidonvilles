require('../module_alias');
const knex = require('#db/knex');

exports.mochaGlobalSetup = async () => {
    await knex.raw('DROP DATABASE IF EXISTS resorption_bidonvilles_tests_template');
    await knex.raw('CREATE DATABASE resorption_bidonvilles_tests_template TEMPLATE resorption_bidonvilles');
};

exports.mochaGlobalTeardown = async () => {
    const response = await knex.raw('SELECT datname FROM pg_database WHERE datname SIMILAR TO \'resorption_bidonvilles_tests_[0-9]+\'');
    await Promise.all(
        response.rows.map(({ datname }) => knex.raw(`DROP DATABASE ${datname}`)),
    );
};
