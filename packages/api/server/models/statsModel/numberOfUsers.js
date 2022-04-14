const sequelize = require('#db/sequelize');

module.exports = async (departement) => {
    const rows = await sequelize.query(
        `
        SELECT COUNT(*) from users
        LEFT JOIN localized_organizations on users.fk_organization = localized_organizations.organization_id
        WHERE fk_status = 'active'
        ${departement ? `AND departement_code = '${departement}'` : ''}
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].count;
};
