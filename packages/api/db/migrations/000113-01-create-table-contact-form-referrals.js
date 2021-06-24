module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'contact_form_referrals',
            {
                contact_form_referral_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                reason: {
                    type: Sequelize.ENUM('dihal_event', 'newsletter', 'social_network', 'word_of_mouth', 'online_search', 'other'),
                    allowNull: false,
                },
                reason_other: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null,
                },
                reason_word_of_mouth: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: null,
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'contact_form_referrals',
                ['fk_user'],
                {
                    type: 'foreign key',
                    name: 'fk_contact_form_referral_user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'contact_form_referrals',
            'fk_contact_form_referral_user',
            {
                transaction,
            },
        )
            .then(() => queryInterface.dropTable('contact_form_referrals', { transaction })),
    ),

};
