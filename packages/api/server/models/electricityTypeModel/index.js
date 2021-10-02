/**
 * Serializes a single electricity-type row
 *
 * @param {Object} electricityType
 *
 * @returns {Object}
 */
function serializeElectricityType(electricityType) {
    return {
        id: electricityType.id,
        label: electricityType.label,
        position: electricityType.position,
        uid: electricityType.uid,
    };
}

module.exports = database => ({
    findAll: async () => {
        const electricityTypes = await database.query(
            `SELECT
                electricity_types.electricity_type_id AS id,
                electricity_types.label AS label,
                electricity_types.position AS position,
                electricity_types.uid AS uid
            FROM electricity_types
            ORDER BY position ASC`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return electricityTypes.map(serializeElectricityType);
    },

    findOne: async (id) => {
        const electricityTypes = await database.query(
            `SELECT
                electricity_types.electricity_type_id AS id,
                electricity_types.label AS label,
                electricity_types.position AS position,
                electricity_types.uid AS uid
            FROM electricity_types
            WHERE electricity_types.electricity_type_id = :id`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    id,
                },
            },
        );

        if (electricityTypes.length !== 1) {
            return null;
        }

        return serializeElectricityType(electricityTypes[0]);
    },
});
