const formatV1 = require('./v1/format');

const STRATEGIES = {
    1: formatV1,
};

module.exports = town => STRATEGIES[1](town);
