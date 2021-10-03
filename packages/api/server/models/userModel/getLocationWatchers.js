const { sequelize } = require('#db/models');
const { mailBlacklist } = require('#server/config');

module.exports = async (location, applyBlacklist = false) => {
    const users = await sequelize.query(
        `SELECT
            u.user_id,
            u.email,
            u.first_name,
            u.last_name
        FROM localized_organizations lo
        LEFT JOIN users u ON u.fk_organization = lo.organization_id
        WHERE
            (
                (lo.location_type = 'departement' AND lo.departement_code = :departementCode)
                OR
                ((lo.location_type = 'epci' OR lo.location_type = 'city') AND lo.epci_code = :epciCode)
            )
            AND u.fk_status = 'active'
            AND lo.active = TRUE`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                departementCode: location.departement.code,
                epciCode: location.epci.code,
            },
        },
    );

    if (applyBlacklist === true) {
        return users.filter(({ user_id }) => !mailBlacklist.includes(user_id));
    }

    return users;
};
