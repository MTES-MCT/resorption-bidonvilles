const sequelize = require('#db/sequelize');

module.exports = (shantytown_id, electricityAccessTypes, transaction = undefined) => sequelize.getQueryInterface().bulkInsert(
    'electricity_access_types',
    electricityAccessTypes.map(type => ({
        fk_shantytown: shantytown_id,
        electricity_access_type: type,
    })),
    {
        transaction,
    },
);
