/**
 * Serializes a single field-type row
 *
 * @param {Object} fieldType
 *
 * @returns {Object}
 */
function serializeFieldType(fieldType) {
    return {
        id: fieldType.id,
        label: fieldType.label,
        color: `#${fieldType.color}`,
        position: fieldType.position,
    };
}

module.exports = database => ({
    findAll: async () => {
        const fieldTypes = await database.query(
            `SELECT
                field_types.field_type_id AS id,
                field_types.label AS label,
                field_types.color AS color,
                field_types.position AS position
            FROM field_types
            ORDER BY position ASC`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return fieldTypes.map(serializeFieldType);
    },

    findOne: async (id) => {
        const fieldTypes = await database.query(
            `SELECT
                field_types.field_type_id AS id,
                field_types.label AS label,
                field_types.color AS color,
                field_types.position AS position
            FROM field_types
            WHERE field_type_id = :id`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    id,
                },
            },
        );

        if (fieldTypes.length !== 1) {
            return null;
        }

        return serializeFieldType(fieldTypes[0]);
    },
});
