const Temporal = require('sequelize-temporal');

module.exports = function (sequelize, DataTypes) {
    const ShantytownOrigin = sequelize.define('ShantytownOrigin', {
        fk_shantytown: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shantytowns',
                key: 'shantytown_id',
            },
        },
        fk_social_origin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'social_origins',
                key: 'social_origin_id',
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
        tableName: 'shantytown_origins',
        underscored: false,
        paranoid: false,
        timestamps: true,
    });

    return Temporal(ShantytownOrigin, sequelize);
};
