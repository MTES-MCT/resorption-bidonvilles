const sequelize = require('#db/sequelize');

module.exports = async (shantytown_id, social_origin_id) => {
    await sequelize.query(
        `INSERT INTO shantytown_origins(fk_shantytown, fk_social_origin)
         VALUES (:shantytown_id, :social_origin_id)`,
        {
            replacements: {
                shantytown_id, social_origin_id,
            },
        },
    );
};
