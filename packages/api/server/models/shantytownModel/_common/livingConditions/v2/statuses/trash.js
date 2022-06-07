const computeStatus = require('./computeStatus');
const isPiling = require('./trash/is_piling');
const evacuationIsclose = require('./trash/evacuation_is_close');
const evacuationIsRegular = require('./trash/evacuation_is_regular');
const evacuationIsSafe = require('./trash/evacuation_is_safe');
const bulkyIsPiling = require('./trash/bulky_is_piling');

module.exports = town => computeStatus(town, {
    isPiling,
    evacuationIsclose,
    evacuationIsRegular,
    evacuationIsSafe,
    bulkyIsPiling,
});
