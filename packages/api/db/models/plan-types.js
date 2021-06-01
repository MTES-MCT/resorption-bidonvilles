const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PlanType extends Model {}

    PlanType.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                field: 'plan_type_id',
            },
            label: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'PlanType',
            tableName: 'plan_types',
        },
    );

    return PlanType;
};
