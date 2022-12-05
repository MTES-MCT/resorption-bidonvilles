import { sequelize } from '#db/sequelize';

export default (shantytownId, incomingTowns, transaction = undefined) => sequelize.query(
    `INSERT INTO shantytown_incoming_towns(fk_shantytown, fk_incoming_town)
    VALUES ${incomingTowns.map(() => '(?, ?)').join(',')}`,
    {
        replacements: incomingTowns.map(incomingTownId => [shantytownId, incomingTownId]).flat(),
        transaction,
    },
);
