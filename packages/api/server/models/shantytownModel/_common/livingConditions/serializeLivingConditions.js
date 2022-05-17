const serializeV1 = require('./v1/serialize');
const serializeV2 = require('./v2/serialize');

const STRATEGIES = {
    1: serializeV1,
    2: serializeV2,
};

module.exports = town => STRATEGIES[town.livingConditionsVersion](town);
