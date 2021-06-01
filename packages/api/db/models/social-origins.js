module.exports = function (sequelize, DataTypes) {
    const SocialOrigin = sequelize.define('SocialOrigin', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'social_origin_id',
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
        tableName: 'social_origins',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    SocialOrigin.associate = function (models) {
        SocialOrigin.belongsToMany(models.Shantytown, {
            through: models.ShantytownOrigin,
            foreignKey: 'fk_social_origin',
        });
    };

    return SocialOrigin;
};
