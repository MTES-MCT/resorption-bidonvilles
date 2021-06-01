module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'permission_id',
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
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
        tableName: 'permissions',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    Permission.associate = (models) => {
        Permission.belongsToMany(models.Role, {
            through: models.RolePermission,
            as: 'roles',
            foreignKey: 'fk_permission',
        });
    };

    return Permission;
};
