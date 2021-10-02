const { sequelize } = require('#db/models');
const serializeElectricityType = require('./_common/serializeElectricityType');

module.exports = async (id) => {
    const electricityTypes = await sequelize.query(
        `SELECT
            electricity_types.electricity_type_id AS id,
            electricity_types.label AS label,
            electricity_types.position AS position,
            electricity_types.uid AS uid
        FROM electricity_types
        WHERE electricity_types.electricity_type_id = :id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    if (electricityTypes.length !== 1) {
        return null;
    }

    return serializeElectricityType(electricityTypes[0]);
};
