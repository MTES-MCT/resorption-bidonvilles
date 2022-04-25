const can = require('#server/utils/permission/can');
const header = require('./1_section_context/header');
const heading = require('./heading');
const name = require('./1_section_context/name');
const builtAt = require('./1_section_context/builtAt');
const owner = require('./1_section_context/owner');
const populationTotal = require('./1_section_context/populationTotal');
const populationCouples = require('./1_section_context/populationCouples');
const populationMinors = require('./1_section_context/populationMinors');
const socialOrigins = require('./1_section_context/socialOrigins');

module.exports = (user, shantytown) => ({
    properties: {},
    children: [
        ...header(shantytown),
        heading('Contexte et localisation du bidonville'),
        name(shantytown.usename),
        builtAt(shantytown.builtAt),
        owner(can(user).do('access', 'shantytown_owner').on(shantytown) ? shantytown.owner : 'non renseigné'),
        populationTotal(shantytown.populationTotal),
        populationCouples(shantytown.populationCouples),
        populationMinors(shantytown.populationMinors),
        socialOrigins(shantytown.socialOrigins),
    ],
});
