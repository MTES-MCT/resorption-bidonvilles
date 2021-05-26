const Temporal = require('sequelize-temporal');

module.exports = function (sequelize, DataTypes) {
    const ShantytownClosingSolution = sequelize.define('ShantytownClosingSolution', {
        fk_shantytown: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shantytowns',
                key: 'shantytown_id',
            },
        },
        fk_closing_solution: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'closing_solutions',
                key: 'closing_solution_id',
            },
        },
        peopleAffected: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'number_of_people_affected',
        },
        householdsAffected: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'number_of_households_affected',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'shantytown_closing_solutions',
        underscored: false,
        paranoid: false,
        timestamps: true,
    });

    return Temporal(ShantytownClosingSolution, sequelize);
};
