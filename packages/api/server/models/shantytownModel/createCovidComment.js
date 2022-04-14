const sequelize = require('#db/sequelize');

module.exports = async (user, shantytownId, data) => sequelize.transaction(async (transaction) => {
    const [[{ id }]] = await sequelize.query(
        `INSERT INTO
                    shantytown_comments(
                        description,
                        fk_shantytown,
                        created_by,
                        private
                    )
                VALUES (:description, :shantytownId, :createdBy, false)
                RETURNING shantytown_comment_id AS id`,
        {
            replacements: {
                shantytownId,
                description: data.description,
                createdBy: user.id,
            },
            transaction,
        },
    );

    return sequelize.query(
        `INSERT INTO
                    shantytown_covid_comments(
                        fk_comment,
                        date,
                        action_mediation_sante,
                        sensibilisation_vaccination,
                        equipe_mobile_depistage,
                        equipe_mobile_vaccination,
                        personnes_orientees,
                        personnes_avec_symptomes,
                        besoin_action,
                        created_by  
                    )
                VALUES
                    (
                        :id,
                        :date,
                        :action_mediation_sante,
                        :sensibilisation_vaccination,
                        :equipe_mobile_depistage,
                        :equipe_mobile_vaccination,
                        :personnes_orientees,
                        :personnes_avec_symptomes,
                        :besoin_action,
                        :created_by
                    )`,
        {
            replacements: Object.assign({
                id,
                created_by: user.id,
            }, data),
            transaction,
        },
    );
});
