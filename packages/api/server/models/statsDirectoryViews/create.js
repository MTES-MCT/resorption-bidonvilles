const sequelize = require('#db/sequelize');

module.exports = async ({
    organization, viewed_by,
}, transaction = undefined) => {
    await sequelize.query(
        `INSERT INTO stats_directory_views(
            organization, 
            viewed_by,
        ) VALUES (
            :organization, 
            :viewed_by,,
        ) RETURNING user_access_id AS id`, {
            replacements: {
                organization,
                viewed_by,
            },
            transaction,
        },
    );
};
