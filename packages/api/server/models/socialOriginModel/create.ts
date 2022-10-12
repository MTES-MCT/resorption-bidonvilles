const sequelize = require('#db/sequelize');

module.exports = (shantytown_id, social_origin_ids, transaction = undefined) => sequelize.getQueryInterface().bulkInsert(
    'shantytown_origins',
    social_origin_ids.map(social_origin_id => ({
        fk_shantytown: shantytown_id,
        fk_social_origin: social_origin_id,
    })),
    {
        transaction,
    },
);
