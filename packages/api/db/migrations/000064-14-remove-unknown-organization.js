module.exports = {

    up: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM organizations WHERE name = \'Inconnu\'',
        {
            type: queryInterface.sequelize.QueryTypes.SELECT,
        },
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'SELECT organization_type_id FROM organization_types LIMIT 1',
        {
            type: queryInterface.sequelize.QueryTypes.SELECT,
        },
    )
        .then(([{ organization_type_id: typeId }]) => queryInterface.sequelize.query(
            'INSERT INTO organizations (name, active, fk_type) VALUES (\'Inconnu\', FALSE, :typeId)',
            {
                replacements: {
                    typeId,
                },
            },
        )),

};
