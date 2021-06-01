module.exports = {

    up: queryInterface => Promise.all([
        queryInterface.removeColumn('plans', 'households_affected'),
        queryInterface.removeColumn('plans', 'people_affected'),
        queryInterface.removeColumn('plans', 'children_schoolable'),
        queryInterface.removeColumn('plans', 'households_who_got_housing_with_help'),
        queryInterface.removeColumn('plans', 'households_who_got_housing_without_help'),
        queryInterface.removeColumn('plans', 'households_who_were_hosted'),
        queryInterface.removeColumn('plans', 'children_schooled'),
        queryInterface.removeColumn('plans', 'people_accessing_health'),
        queryInterface.removeColumn('plans', 'people_helped_for_employment'),
        queryInterface.removeColumn('plans', 'people_who_got_employment'),
        queryInterface.removeColumn('plans', 'households_domiciled'),
        queryInterface.removeColumn('plans', 'people_included'),
        queryInterface.removeColumn('plans', 'people_successfully_helped'),
        queryInterface.removeColumn('plans', 'people_excluded'),
        queryInterface.removeColumn('plans', 'people_who_resigned'),
        queryInterface.removeColumn('plans', 'people_pole_emploi'),
        queryInterface.removeColumn('plans', 'people_mission_locale'),
        queryInterface.removeColumn('plans', 'people_with_bank_account'),
        queryInterface.removeColumn('plans', 'people_trainee'),
        queryInterface.removeColumn('plans', 'average_duration'),
        queryInterface.removeColumn('plans', 'comment'),
        queryInterface.removeColumn('plans', 'households'),
        queryInterface.removeColumn('plans', 'people'),
        queryInterface.removeColumn('plans', 'european_people'),
        queryInterface.removeColumn('plans', 'french_people'),
        queryInterface.removeColumn('plans', 'non_european_people'),
        queryInterface.removeColumn('plans', 'young_kids'),
        queryInterface.removeColumn('plans', 'other_kids'),
        queryInterface.removeColumn('plans', 'schooled_kids'),
        queryInterface.removeColumn('plans', 'people_asking_for_cmu'),
        queryInterface.removeColumn('plans', 'people_with_cmu'),
        queryInterface.removeColumn('plans', 'minors_with_admin_procedure'),
        queryInterface.removeColumn('plans', 'minors_with_justice_procedure'),
    ]),

    down: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn('plans', 'households_affected', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_affected', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'children_schoolable', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'households_who_got_housing_with_help', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'households_who_got_housing_without_help', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'households_who_were_hosted', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'children_schooled', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_accessing_health', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_helped_for_employment', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_who_got_employment', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'households_domiciled', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_included', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_successfully_helped', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_excluded', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_who_resigned', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_pole_emploi', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_mission_locale', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_with_bank_account', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_trainee', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'average_duration', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'comment', {
            type: Sequelize.TEXT,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'households', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'european_people', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'french_people', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'non_european_people', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'young_kids', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'other_kids', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'schooled_kids', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_asking_for_cmu', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'people_with_cmu', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'minors_with_admin_procedure', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plans', 'minors_with_justice_procedure', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
    ]),

};
