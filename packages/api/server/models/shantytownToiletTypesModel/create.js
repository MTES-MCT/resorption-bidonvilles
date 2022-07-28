const sequelize = require('#db/sequelize');

module.exports = (shantytown_id, toiletTypes, transaction = undefined) => sequelize.getQueryInterface().bulkInsert(
    'shantytown_toilet_types',
    toiletTypes.map(type => ({
        fk_shantytown: shantytown_id,
        toilet_type: type,
    })),
    {
        transaction,
    },
);
