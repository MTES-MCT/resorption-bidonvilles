/* eslint-disable newline-per-chained-call,no-await-in-loop, no-restricted-syntax */
require('../../module_alias');
const { create: createShantyTown } = require('#server/models/shantytownModel');
const { create } = require('#server/models/shantytownCommentModel');

const shantytowns = [
    {
        id: 999999,
        status: 'open',
        createdBy: 1,
        latitude: 44.837789,
        longitude: -0.57918,
        address: 'Bordeaux',
        city: '33063', // Bordeaux
        fieldType: 1, // inconnu
        ownerType: 2, // privé
        owner: 'John Doe',
        electricityType: 1, // inconnu
    },
];

const comments = [
    {
        description: 'commentaire publique',
        private: false,
        fk_shantytown: 999999,
        created_by: 'qa-asso-city@resorption-bidonvilles.beta.gouv.fr',
    },
    {
        description: 'commentaire privé',
        private: true,
        fk_shantytown: 999999,
        created_by: 'qa-local-admin@resorption-bidonvilles.beta.gouv.fr',
    },
];

module.exports = {
    up: async (queryInterface) => {
        for (const shantytown of shantytowns) {
            await createShantyTown(shantytown);
        }

        for (const comment of comments) {
            // Resolve userId from email
            const [[{ user_id: userId }]] = await queryInterface.sequelize.query('SELECT user_id FROM users where email = :email', { replacements: { email: comment.created_by } });

            // Resolve shantytown comment targets
            let organizations = [];
            if (comment.private) {
                organizations = await queryInterface.sequelize.query(
                    `SELECT o.organization_id AS id
                    FROM organizations o
                    LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
                    WHERE ot.uid IN ('pref_departement', 'pref_region', 'ddets')
                        AND (o.fk_departement = '33' OR o.fk_region = '75')`, // gironde et nouvelle-aquitaine
                    {
                        type: queryInterface.sequelize.QueryTypes.SELECT,
                    },
                );
            }

            await create({
                ...comment,
                targets: {
                    users: [],
                    organizations,
                },
                created_by: userId,
            });
        }
    },

    down: (queryInterface) => {
        const shantytownIds = shantytowns.map(s => s.id);

        return queryInterface.sequelize.transaction(
            transaction => queryInterface.sequelize.query(
                'DELETE FROM "ShantytownHistories" WHERE shantytown_id in (:ids);',
                {
                    transaction,
                    replacements: {
                        ids: shantytownIds,
                    },
                },
            )
                .then(() => queryInterface.sequelize.query(
                    'DELETE FROM shantytowns WHERE shantytown_id in (:ids);',
                    {
                        transaction,
                        replacements: {
                            ids: shantytownIds,
                        },
                    },
                )),
        );
    },
};
