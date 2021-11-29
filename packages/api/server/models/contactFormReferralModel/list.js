const { sequelize } = require('#db/models');

module.exports = (location) => {
    let where = null;
    const replacements = {};

    if (location && location.code) {
        if (location.type === 'region') {
            where = 'region_code = :locationCode';
            replacements.locationCode = location.code;
        } else if (location.type === 'departement') {
            where = 'departement_code = :locationCode';
            replacements.locationCode = location.code;
        } else {
            where = 'FALSE';
        }
    }

    return sequelize.query(
        `SELECT 
                INITCAP(first_name) AS first_name,
                UPPER(last_name) AS last_name,
                email,
                departement_code,
                name AS organization_name,
                reason,
                reason_other,
                reason_word_of_mouth
            FROM contact_form_referrals
            LEFT JOIN users ON fk_user = user_id
            LEFT JOIN localized_organizations ON fk_organization = organization_id
            ${where !== null ? `WHERE ${where}` : ''}`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );
};
