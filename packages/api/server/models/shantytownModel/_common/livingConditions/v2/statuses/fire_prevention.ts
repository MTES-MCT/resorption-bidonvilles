const computeStatus = require('./computeStatus');
const diagnostic = require('./fire_prevention/diagnostic');

module.exports = town => computeStatus(town, {
    diagnostic,
});
