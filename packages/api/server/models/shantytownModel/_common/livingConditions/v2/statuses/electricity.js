const computeStatus = require('./computeStatus');
const access = require('./electricity/access');
const accessTypes = require('./electricity/access_types');
const accessIsUnequal = require('./electricity/access_is_unequal');

module.exports = town => computeStatus(town, {
    access,
    accessTypes,
    accessIsUnequal,
});
