module.exports = function (sequelize, DataTypes) {
    const Region = sequelize.define('Region', {
        code: {
            type: DataTypes.STRING(2),
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
        tableName: 'regions',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    return Region;
};
