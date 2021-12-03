/* eslint-disable newline-per-chained-call,no-await-in-loop, no-restricted-syntax */
require('module-alias/register');

const plans = [
    {
        plan_id: 999999,
        name: '[QA] D1',
        started_at: '2021-01-01',
        in_and_out: true,
        goals: 'objectifs',
        location_type: 'housing',
        created_by_email: 'qa-prefecture@resorption-bidonvilles.beta.gouv.fr',
        operator_email: 'qa-asso-departement@resorption-bidonvilles.beta.gouv.fr',
    },
];

module.exports = {
    up: async (queryInterface) => {
        const transaction = await queryInterface.sequelize.transaction();
        for (const plan of plans) {
            const [{ user_id: userId }, { user_id: operatorId }] = await queryInterface.sequelize.query(
                'SELECT user_id FROM users WHERE email IN (:managerEmail, :operatorEmail) ORDER BY email DESC',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    replacements: {
                        managerEmail: plan.created_by_email,
                        operatorEmail: plan.operator_email,
                    },
                    transaction,
                },
            );

            await queryInterface.sequelize.query(
                `INSERT INTO plans2(
                    plan_id,
                    name,
                    started_at,
                    in_and_out,
                    goals,
                    fk_category,
                    location_type,
                    created_by
                ) VALUES(
                    :plan_id,
                    :name,
                    :started_at,
                    :in_and_out,
                    :goals,
                    'autre',
                    :location_type,
                    :created_by
                )`,
                {
                    replacements: {
                        ...plan,
                        created_by: userId,
                    },
                    transaction,
                },
            );

            const { plan_id: planId } = plan;

            await Promise.all([
                queryInterface.sequelize.query(
                    `INSERT INTO plan_departements(fk_plan, fk_departement, created_by)
                    VALUES (:planId, '33', :createdBy)`,
                    {
                        replacements: {
                            planId,
                            createdBy: userId,
                        },
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    `INSERT INTO plan_topics(fk_plan, fk_topic, created_by)
                    VALUES (:planId, 'health', :userId)`,
                    {
                        replacements: {
                            planId,
                            userId,
                        },
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    `INSERT INTO plan_managers(fk_plan, fk_user, created_by)
                    VALUES (:planId, :userId, :createdBy)`,
                    {
                        replacements: {
                            planId,
                            userId,
                            createdBy: userId,
                        },
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    `INSERT INTO plan_operators(fk_plan, fk_user, created_by)
                    VALUES (:planId, :userId, :createdBy)`,
                    {
                        replacements: {
                            planId,
                            userId: operatorId,
                            createdBy: userId,
                        },
                        transaction,
                    },
                ),
            ]);
        }

        await transaction.commit();
    },

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM plans2 WHERE name ILIKE \'[QA]%\'',
            {
                transaction,
            },
        ),
    ),
};
