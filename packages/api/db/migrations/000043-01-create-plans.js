module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'plans',
        {
            plan_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            ended_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            fk_ngo: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_type: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            households_affected: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_affected: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            children_schoolable: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            households_who_got_housing_with_help: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            households_who_got_housing_without_help: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            households_who_were_hosted: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            children_schooled: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_accessing_health: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_helped_for_employment: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_who_got_employment: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            households_domiciled: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_included: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_successfully_helped: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_excluded: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_who_resigned: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_pole_emploi: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_mission_locale: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_with_bank_account: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_trainee: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            average_duration: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            households: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            european_people: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            french_people: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            non_european_people: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            young_kids: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            other_kids: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            schooled_kids: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_asking_for_cmu: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            people_with_cmu: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            minors_with_admin_procedure: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            minors_with_justice_procedure: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
    ),

    down: queryInterface => queryInterface.dropTable('plans'),

};
