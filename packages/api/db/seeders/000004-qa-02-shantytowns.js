/* eslint-disable newline-per-chained-call,no-await-in-loop, no-restricted-syntax */
require('module-alias/register');
const {
    Shantytown: ShantyTowns,
} = require('#db/models');

const { create } = require('#server/models/shantytownCommentModel')();

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
            await ShantyTowns.create(shantytown);
        }

        for (const comment of comments) {
            // Resolve userId from email
            const [[{ user_id: userId }]] = await queryInterface.sequelize.query('SELECT user_id from USERS where email = :email', { replacements: { email: comment.created_by } });

            await create({
                ...comment,
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
