module.exports = function (sequelize, DataTypes) {
    const ShantytownComment = sequelize.define('ShantytownComment', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'shantytown_comment_id',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        private: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        shantytown: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shantytowns',
                key: 'shantytown_id',
            },
            field: 'fk_shantytown',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id',
            },
            field: 'created_by',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'shantytown_comments',
        underscored: true,
        paranoid: false,
        timestamps: true,
    });

    ShantytownComment.associate = (models) => {
        ShantytownComment.belongsTo(models.Shantytown, { foreignKey: 'fk_shantytown' });
        ShantytownComment.belongsTo(models.User, { foreignKey: 'created_by' });
    };

    return ShantytownComment;
};
