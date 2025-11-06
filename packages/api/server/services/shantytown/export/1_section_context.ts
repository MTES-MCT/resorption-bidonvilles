import can from '#server/utils/permission/can';
import { SectionType } from 'docx';
import header from './1_section_context/header';
import heading from './heading';
import builtAt from './1_section_context/builtAt';
import declaredAt from './1_section_context/declaredAt';
import fieldType from './1_section_context/fieldType';
import coordinates from './1_section_context/coordinates';
import owner from './1_section_context/owner';


export default (user, shantytown) => ({
    properties: {
        type: SectionType.CONTINUOUS,
    },
    children: [
        ...header(shantytown),
        heading('Caractéristiques du site'),
        builtAt(shantytown.builtAt),
        declaredAt(shantytown.declaredAt),
        fieldType(shantytown.fieldType.label),
        coordinates(shantytown.latitude, shantytown.longitude),
        owner(can(user).do('access', 'shantytown_owner').on(shantytown) ? shantytown.owner : 'donnée masquée'),
    ],
});
