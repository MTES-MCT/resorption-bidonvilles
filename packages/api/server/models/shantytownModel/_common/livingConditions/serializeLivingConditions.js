const serializeV1 = require('./v1/serialize');

const STRATEGIES = {
    1: serializeV1,
};

module.exports = town => STRATEGIES[1](town);
