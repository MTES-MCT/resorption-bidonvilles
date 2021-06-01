module.exports = function (sequelize, DataTypes) {
    const Epci = sequelize.define('Epci', {
        code: {
            type: DataTypes.STRING(9),
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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
        tableName: 'epci',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    return Epci;
};
