const computeStatus = require('./computeStatus');
const openAirDefecation = require('./sanitary/open_air_defecation');
const workingToilets = require('./sanitary/working_toilets');
const toiletTypes = require('./sanitary/toilet_types');
const toiletsAreInside = require('./sanitary/toilets_are_inside');
const toiletsAreLighted = require('./sanitary/toilets_are_lighted');
const handWashing = require('./sanitary/hand_washing');

module.exports = town => computeStatus(town, {
    openAirDefecation,
    workingToilets,
    toiletTypes,
    toiletsAreInside,
    toiletsAreLighted,
    handWashing,
});
