const getStatusesV1 = require('./v1/statuses/main');

const STRATEGIES = {
    1: getStatusesV1,
};

module.exports = town => STRATEGIES[1](town);
