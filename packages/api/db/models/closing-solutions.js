module.exports = function (sequelize, DataTypes) {
    const ClosingSolution = sequelize.define('ClosingSolution', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'closing_solution_id',
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        tableName: 'closing_solutions',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    ClosingSolution.associate = function (models) {
        ClosingSolution.belongsToMany(models.Shantytown, {
            through: models.ShantytownClosingSolution,
            foreignKey: 'fk_closing_solution',
        });
    };

    return ClosingSolution;
};
