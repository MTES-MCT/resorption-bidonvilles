const { sequelize } = require('#db/models');

module.exports = async (organizationId, values) => {
    if (organizationId === undefined) {
        throw new Error('The organization id is missing');
    }

    const allowedProperties = [
        'being_funded', 'being_funded_at',
    ];
    const propertiesToColumns = {
        being_funded: 'being_funded',
        being_funded_at: 'being_funded_at',
    };
    const setClauses = [];
    const replacements = {};

    allowedProperties.forEach((property) => {
        if (values && values[property] !== undefined) {
            setClauses.push(`${propertiesToColumns[property]} = :${property}`);
            replacements[property] = values[property];
        }
    });

    if (setClauses.length === 0) {
        throw new Error('The updated values are missing');
    }

    const transaction = await sequelize.transaction();
    const [, { rowCount }] = await sequelize.query(
        `UPDATE
            organizations
        SET
            ${setClauses.join(',')}
        WHERE
            organizations.organization_id = :organizationId`,
        {
            replacements: Object.assign(replacements, {
                organizationId,
            }),
            transaction,
        },
    );

    if (rowCount === 0) {
        throw new Error(`The organization #${organizationId} does not exist`);
    }

    await sequelize.query(
        'REFRESH MATERIALIZED VIEW localized_organizations',
        {
            transaction,
        },
    );
    return transaction.commit();
};
