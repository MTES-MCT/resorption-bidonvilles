module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'actions',
        'ended_at',
        {
            type: Sequelize.DATE,
            allowNull: true,
        },
    ).then(() => queryInterface.addConstraint('actions', ['ended_at'], {
        type: 'check',
        name: 'check_ended_after_start',
        where: {
            [Sequelize.Op.or]: [
                {
                    ended_at: { [Sequelize.Op.eq]: null },
                },
                {
                    ended_at: {
                        [Sequelize.Op.ne]: null,
                        [Sequelize.Op.gt]: Sequelize.col('started_at'),
                    },
                },
            ],
        },
    })),

    down: queryInterface => queryInterface.removeConstraint('actions', 'check_ended_after_start')
        .then(() => queryInterface.removeColumn('actions', 'ended_at')),
};
