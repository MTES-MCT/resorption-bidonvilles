const formatElectricityConditions = require('./electricity');
const formatWaterConditions = require('./water');
const formatTrashConditions = require('./trash');
const formatSanitaryConditions = require('./sanitary');
const formatVerminConditions = require('./vermin');
const formatFirePreventionConditions = require('./firePrevention');

module.exports = town => ({
    electricity: formatElectricityConditions(town),
    water: formatWaterConditions(town),
    trash: formatTrashConditions(town),
    sanitary: formatSanitaryConditions(town),
    vermin: formatVerminConditions(town),
    firePrevention: formatFirePreventionConditions(town),
});
