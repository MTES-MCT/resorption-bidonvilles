const sequelize = require('#db/sequelize');
const serializeElectricityType = require('./_common/serializeElectricityType');

module.exports = async (uid) => {
    const electricityTypes = await sequelize.query(
        `SELECT
            electricity_types.electricity_type_id AS id,
            electricity_types.label AS label,
            electricity_types.position AS position,
            electricity_types.uid AS uid
        FROM electricity_types
        WHERE electricity_types.uid = :uid`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                uid,
            },
        },
    );

    if (electricityTypes.length !== 1) {
        return null;
    }

    return serializeElectricityType(electricityTypes[0]);
};
