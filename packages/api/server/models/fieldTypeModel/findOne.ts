import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import serializeFieldType from './_common/serializeFieldType';
import { RawFieldType } from './findOne.d';
import { FieldType } from '#root/types/resources/FieldType.d';

export default async (id: number): Promise<FieldType> => {
    const fieldTypes: RawFieldType[] = await sequelize.query(
        `SELECT
            field_types.field_type_id AS id,
            field_types.label AS label,
            field_types.color AS color,
            field_types.position AS position
        FROM field_types
        WHERE field_type_id = :id`,
        {
            type: QueryTypes.SELECT,
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
