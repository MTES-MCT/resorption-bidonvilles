const computeStatus = require('./computeStatus');
const accessType = require('./water/access_type');
const accessIsPublic = require('./water/access_is_public');
const accessIsContinuous = require('./water/access_is_continuous');
const accessIsLocal = require('./water/access_is_local');
const accessIsClose = require('./water/access_is_close');
const accessIsUnequal = require('./water/access_is_unequal');
const accessHasStagnantWater = require('./water/access_has_stagnant_water');

module.exports = town => computeStatus(town, {
    accessType,
    accessIsPublic,
    accessIsContinuous,
    accessIsLocal,
    accessIsClose,
    accessIsUnequal,
    accessHasStagnantWater,
});
