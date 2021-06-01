module.exports = function (sequelize, DataTypes) {
    return sequelize.define('OwnerType', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'owner_type_id',
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
            onUpdate : DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'owner_types',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });
};
