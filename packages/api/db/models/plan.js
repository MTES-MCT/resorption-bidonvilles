const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Plan extends Model {
        serialize() {
            return {
                id: this.plan_id,
                name: this.name,
            };
        }

        static async findAll() {
            return (await super.findAll()).map(row => row.serialize());
        }

        static async findByPk(ownerTypeId) {
            const ownerType = await super.findByPk(ownerTypeId);
            if (ownerType === null) {
                return ownerType;
            }

            return ownerType.serialize();
        }
    }

    Plan.init({
        owner_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'uk_owner_types_label',
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            // @todo: allowNull true and defaultValue NULL
            allowNull: false,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    }, {
        tableName: 'plans',
        sequelize,
        paranoid: false,
    });

    return Plan;
};
