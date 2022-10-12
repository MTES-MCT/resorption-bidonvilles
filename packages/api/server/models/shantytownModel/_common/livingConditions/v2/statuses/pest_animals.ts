const computeStatus = require('./computeStatus');
const presence = require('./pest_animals/presence');

module.exports = town => computeStatus(town, {
    presence,
});
