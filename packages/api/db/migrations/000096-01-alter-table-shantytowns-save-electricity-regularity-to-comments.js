const regularComment = 'L\'accès à l\'électricité est régulier. ';
const irregularComment = 'L\'accès à l\'électricité est irrégulier. ';
const yesLabel = 'Oui';
const regularLabel = 'Oui (accès régulier)';
const irregularLabel = 'Oui (accès irrégulier)';

module.exports = {
    up: queryInterface => queryInterface.sequelize.query('SELECT electricity_type_id as id, label FROM electricity_types', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
    }).then((data) => {
        const yes = data.find(d => d.label === yesLabel);
        const yesRegular = data.find(d => d.label === regularLabel);
        const yesIrregular = data.find(d => d.label === irregularLabel);

        if (!yes || !yesRegular || !yesIrregular) {
            throw new Error('Electricity types should exist');
        }

        // Add comments
        return queryInterface.sequelize.transaction(
            transaction => Promise.all([
                // Update Oui (acces régulier)
                queryInterface.sequelize.query(
                    `UPDATE shantytowns SET electricity_comments = CONCAT(:regularComment, COALESCE(electricity_comments, '')) WHERE fk_electricity_type = ${yesRegular.id}`,
                    {
                        transaction,
                        replacements: { regularComment },
                    },
                ),
                queryInterface.sequelize.query(
                    `UPDATE "ShantytownHistories" SET electricity_comments = CONCAT(:regularComment, COALESCE(electricity_comments, '')) WHERE fk_electricity_type = ${yesRegular.id}`,
                    {
                        transaction,
                        replacements: { regularComment },
                    },
                ),
                // Update Oui (acces irrégulier)
                queryInterface.sequelize.query(
                    `UPDATE shantytowns SET electricity_comments = CONCAT(:irregularComment, COALESCE(electricity_comments, '')) WHERE fk_electricity_type = ${yesIrregular.id}`,
                    {
                        transaction,
                        replacements: { irregularComment },
                    },
                ),
                queryInterface.sequelize.query(
                    `UPDATE "ShantytownHistories" SET electricity_comments = CONCAT(:irregularComment, COALESCE(electricity_comments, '')) WHERE fk_electricity_type = ${yesIrregular.id}`,
                    {
                        transaction,
                        replacements: { irregularComment },
                    },
                ),
                queryInterface.sequelize.query(
                    `UPDATE shantytowns SET fk_electricity_type = ${yes.id} where fk_electricity_type IN (${yesRegular.id}, ${yesIrregular.id})`,
                    {
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    `UPDATE "ShantytownHistories" SET fk_electricity_type = ${yes.id} where fk_electricity_type IN (${yesRegular.id}, ${yesIrregular.id})`,
                    {
                        transaction,
                    },
                ),
            ])
                .then(() => queryInterface.sequelize.query(
                    `DELETE FROM electricity_types WHERE electricity_type_id IN (${yesRegular.id}, ${yesIrregular.id})`,
                    {
                        transaction,
                    },
                )),
        );
    }),


    down: queryInterface => queryInterface.sequelize.transaction(
        // Insert back Oui (acces régulier and acces irrégulier)
        transaction => queryInterface.bulkInsert(
            'electricity_types',
            [
                { label: regularLabel, position: 1 },
                { label: irregularLabel, position: 2 },
            ],
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query('SELECT electricity_type_id as id, label FROM electricity_types', {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            }))
            .then((data) => {
                const yesRegular = data.find(d => d.label === regularLabel);
                const yesIrregular = data.find(d => d.label === irregularLabel);

                if (!yesRegular || !yesIrregular) {
                    throw new Error('Electricity types should exist');
                }

                return Promise.all([
                    queryInterface.sequelize.query(
                        `UPDATE shantytowns SET fk_electricity_type = ${yesRegular.id} where electricity_comments ILIKE CONCAT (:regularComment, '%')`,
                        {
                            transaction,
                            replacements: { regularComment },
                        },
                    ),
                    queryInterface.sequelize.query(`UPDATE "ShantytownHistories" SET fk_electricity_type = ${yesRegular.id} where electricity_comments ILIKE CONCAT (:regularComment, '%')`,
                        {
                            transaction,
                            replacements: { regularComment },
                        }),
                    queryInterface.sequelize.query(
                        `UPDATE shantytowns SET fk_electricity_type = ${yesIrregular.id} where electricity_comments ILIKE CONCAT (:irregularComment, '%')`,
                        {
                            transaction,
                            replacements: { irregularComment },
                        },
                    ),
                    queryInterface.sequelize.query(
                        `UPDATE "ShantytownHistories" SET fk_electricity_type = ${yesIrregular.id} where electricity_comments ILIKE CONCAT (:irregularComment, '%')`,
                        {
                            transaction,
                            replacements: { irregularComment },
                        },
                    ),
                ])
                    .then(() => Promise.all([
                        queryInterface.sequelize.query(
                            'UPDATE shantytowns SET electricity_comments = REPLACE(electricity_comments, :irregularComment, \'\') where electricity_comments ILIKE CONCAT (:irregularComment, \'%\')',
                            {
                                transaction,
                                replacements: { irregularComment },
                            },
                        ),
                        queryInterface.sequelize.query(
                            'UPDATE "ShantytownHistories" SET electricity_comments = REPLACE(electricity_comments, :irregularComment, \'\') where electricity_comments ILIKE CONCAT (:irregularComment, \'%\')',
                            {
                                transaction,
                                replacements: { irregularComment },
                            },
                        ),
                        queryInterface.sequelize.query(
                            'UPDATE shantytowns SET electricity_comments = REPLACE(electricity_comments, :regularComment, \'\') where electricity_comments ILIKE CONCAT (:regularComment, \'%\')',
                            {
                                transaction,
                                replacements: { regularComment },
                            },
                        ),
                        queryInterface.sequelize.query(
                            'UPDATE "ShantytownHistories" SET electricity_comments = REPLACE(electricity_comments, :regularComment, \'\') where electricity_comments ILIKE CONCAT (:regularComment, \'%\')',
                            {
                                transaction,
                                replacements: { regularComment },
                            },
                        ),
                    ]));
            }),
    ),
};
