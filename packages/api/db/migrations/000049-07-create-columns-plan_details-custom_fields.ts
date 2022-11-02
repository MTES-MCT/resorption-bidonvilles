module.exports = {

    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn('plan_details', 'households_affected', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_affected', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'children_schoolable', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'households_who_got_housing_with_help', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'households_who_got_housing_without_help', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'households_who_were_hosted', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'children_schooled', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_accessing_health', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_helped_for_employment', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_who_got_employment', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'households_domiciled', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_included', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_successfully_helped', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_excluded', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_who_resigned', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_pole_emploi', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_mission_locale', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_with_bank_account', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_trainee', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'average_duration', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'comment', {
            type: Sequelize.TEXT,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'households', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'european_people', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'french_people', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'non_european_people', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'young_kids', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'other_kids', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'schooled_kids', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_asking_for_cmu', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'people_with_cmu', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'minors_with_admin_procedure', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
        queryInterface.addColumn('plan_details', 'minors_with_justice_procedure', {
            type: Sequelize.INTEGER,
            allowNull: true,
        }),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn('plan_details', 'households_affected'),
        queryInterface.removeColumn('plan_details', 'people_affected'),
        queryInterface.removeColumn('plan_details', 'children_schoolable'),
        queryInterface.removeColumn('plan_details', 'households_who_got_housing_with_help'),
        queryInterface.removeColumn('plan_details', 'households_who_got_housing_without_help'),
        queryInterface.removeColumn('plan_details', 'households_who_were_hosted'),
        queryInterface.removeColumn('plan_details', 'children_schooled'),
        queryInterface.removeColumn('plan_details', 'people_accessing_health'),
        queryInterface.removeColumn('plan_details', 'people_helped_for_employment'),
        queryInterface.removeColumn('plan_details', 'people_who_got_employment'),
        queryInterface.removeColumn('plan_details', 'households_domiciled'),
        queryInterface.removeColumn('plan_details', 'people_included'),
        queryInterface.removeColumn('plan_details', 'people_successfully_helped'),
        queryInterface.removeColumn('plan_details', 'people_excluded'),
        queryInterface.removeColumn('plan_details', 'people_who_resigned'),
        queryInterface.removeColumn('plan_details', 'people_pole_emploi'),
        queryInterface.removeColumn('plan_details', 'people_mission_locale'),
        queryInterface.removeColumn('plan_details', 'people_with_bank_account'),
        queryInterface.removeColumn('plan_details', 'people_trainee'),
        queryInterface.removeColumn('plan_details', 'average_duration'),
        queryInterface.removeColumn('plan_details', 'comment'),
        queryInterface.removeColumn('plan_details', 'households'),
        queryInterface.removeColumn('plan_details', 'people'),
        queryInterface.removeColumn('plan_details', 'european_people'),
        queryInterface.removeColumn('plan_details', 'french_people'),
        queryInterface.removeColumn('plan_details', 'non_european_people'),
        queryInterface.removeColumn('plan_details', 'young_kids'),
        queryInterface.removeColumn('plan_details', 'other_kids'),
        queryInterface.removeColumn('plan_details', 'schooled_kids'),
        queryInterface.removeColumn('plan_details', 'people_asking_for_cmu'),
        queryInterface.removeColumn('plan_details', 'people_with_cmu'),
        queryInterface.removeColumn('plan_details', 'minors_with_admin_procedure'),
        queryInterface.removeColumn('plan_details', 'minors_with_justice_procedure'),
    ]),

};
