/* eslint-disable newline-per-chained-call */
const selfUserIdValidator = require('./utils/selfUserId');

module.exports = [
    selfUserIdValidator('Vous ne pouvez pas retirer un autre intervenant'),
];
