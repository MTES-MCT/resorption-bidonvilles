module.exports = function (sequelize, DataTypes) {
    const RolePermission = sequelize.define('RolePermission', {
        fk_role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'role_id',
            },
        },
        fk_permission: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'permissions',
                key: 'permission_id',
            },
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
        tableName: 'role_permissions',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    return RolePermission;
};
