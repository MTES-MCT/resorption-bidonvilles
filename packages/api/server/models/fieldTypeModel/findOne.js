const { sequelize } = require('#db/models');
const serializeFieldType = require('./_common/serializeFieldType');

module.exports = async (id) => {
    const fieldTypes = await sequelize.query(
        `SELECT
            field_types.field_type_id AS id,
            field_types.label AS label,
            field_types.color AS color,
            field_types.position AS position
        FROM field_types
        WHERE field_type_id = :id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    if (fieldTypes.length !== 1) {
        return null;
    }

    return serializeFieldType(fieldTypes[0]);
};
