import { FieldType } from '#root/types/resources/FieldType.d';
import { RawFieldType } from '../findOne.d';

export default (fieldType: RawFieldType): FieldType => ({
    id: fieldType.id,
    label: fieldType.label,
    color: `#${fieldType.color}`,
    position: fieldType.position,
});
