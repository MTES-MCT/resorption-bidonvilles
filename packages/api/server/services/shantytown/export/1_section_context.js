const can = require('#server/utils/permission/can');
const { SectionType } = require('docx');
const header = require('./1_section_context/header');
const heading = require('./heading');
const builtAt = require('./1_section_context/builtAt');
const declaredAt = require('./1_section_context/declaredAt');
const fieldType = require('./1_section_context/fieldType');
const coordinates = require('./1_section_context/coordinates');
const owner = require('./1_section_context/owner');


module.exports = (user, shantytown) => ({
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
        owner(shantytown.ownerType.label, can(user).do('access', 'shantytown_owner').on(shantytown) ? shantytown.owner : 'non renseigné'),
    ],
});
