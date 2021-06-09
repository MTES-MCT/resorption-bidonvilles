module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `INSERT INTO organization_types(
                name_singular,
                name_plural,
                fk_category,
                fk_role
            )
            VALUES (
                'Défenseur des droits',
                'Défenseurs des droits',
                'public_establishment',
                'collaborator'
            )
            RETURNING organization_type_id`,
            {
                transaction,
            },
        )
            .then(([[{ organization_type_id }]]) => queryInterface.sequelize.query(
                `INSERT INTO organizations(
                    name,
                    active,
                    fk_type
                )
                VALUES(
                    'Défenseur des droits',
                    TRUE,
                    :organization_type_id
                )`,
                {
                    replacements: {
                        organization_type_id,
                    },
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM organizations WHERE name = :name',
            {
                replacements: {
                    name: 'Défenseur des droits',
                },
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM organization_types WHERE name_singular = :name',
                {
                    replacements: {
                        name: 'Défenseur des droits',
                    },
                    transaction,
                },
            )),
    ),
};
