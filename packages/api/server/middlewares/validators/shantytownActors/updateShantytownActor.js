/* eslint-disable newline-per-chained-call */
const selfUserIdValidator = require('./utils/selfUserId');
const themesValidator = require('./utils/themes');

module.exports = [
    selfUserIdValidator('Vous ne pouvez pas modifier les champs d\'intervention d\'un autre intervenant'),
    themesValidator,
];
