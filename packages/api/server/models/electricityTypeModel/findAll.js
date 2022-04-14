const sequelize = require('#db/sequelize');
const serializeElectricityType = require('./_common/serializeElectricityType');

module.exports = async () => {
    const electricityTypes = await sequelize.query(
        `SELECT
            electricity_types.electricity_type_id AS id,
            electricity_types.label AS label,
            electricity_types.position AS position,
            electricity_types.uid AS uid
        FROM electricity_types
        ORDER BY position ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return electricityTypes.map(serializeElectricityType);
};
