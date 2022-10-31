import { sequelize } from '#db/sequelize';

export default (shantytown_id, toiletTypes, transaction = undefined) => sequelize.getQueryInterface().bulkInsert(
    'shantytown_toilet_types',
    toiletTypes.map(type => ({
        fk_shantytown: shantytown_id,
        toilet_type: type,
    })),
    {
        transaction,
    },
);
