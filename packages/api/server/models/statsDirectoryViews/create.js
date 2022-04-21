const sequelize = require('#db/sequelize');

module.exports = (organization, viewed_by) => sequelize.query(
    `INSERT INTO stats_directory_views(
        organization,
        viewed_by
    ) VALUES (
        :organization,
        :viewed_by
    )`, {
        replacements: {
            organization,
            viewed_by,
        },
    },
);
