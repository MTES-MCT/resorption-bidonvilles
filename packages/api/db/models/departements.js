module.exports = function (sequelize, DataTypes) {
    const Departement = sequelize.define('Departement', {
        code: {
            type: DataTypes.STRING(3),
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        region: {
            type: DataTypes.STRING(2),
            allowNull: false,
            references: {
                model: 'regions',
                key: 'code',
            },
            field: 'fk_region',
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
        tableName: 'departements',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    Departement.associate = (models) => {
        Departement.belongsTo(models.Region, { foreignKey: 'fk_region' });
    };

    return Departement;
};
