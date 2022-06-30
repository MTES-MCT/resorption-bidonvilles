const appVersion = require('./appVersionMiddleware');
const auth = require('./authMiddleware');
const charte = require('./charteMiddleware');
const shantytown = require('./shantytownMiddleware');
const validation = require('./validationMiddleware');

module.exports = {
    appVersion,
    auth,
    charte,
    shantytown,
    validation,
};
