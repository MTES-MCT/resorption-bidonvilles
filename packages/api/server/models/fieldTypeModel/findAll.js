const { sequelize } = require('#db/models');
const serializeFieldType = require('./_common/serializeFieldType');

module.exports = async () => {
    const fieldTypes = await sequelize.query(
        `SELECT
            field_types.field_type_id AS id,
            field_types.label AS label,
            field_types.color AS color,
            field_types.position AS position
        FROM field_types
        ORDER BY position ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return fieldTypes.map(serializeFieldType);
};
