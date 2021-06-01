module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'role_id',
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
        tableName: 'roles',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    Role.associate = (models) => {
        Role.belongsToMany(models.Permission, {
            through: models.RolePermission,
            as: 'permissions',
            foreignKey: 'fk_role',
        });
    };

    return Role;
};
