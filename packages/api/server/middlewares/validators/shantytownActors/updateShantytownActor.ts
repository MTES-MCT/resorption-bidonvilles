/* eslint-disable newline-per-chained-call */
import selfUserIdValidator from './utils/selfUserId';
import themesValidator from './utils/themes';

export default [
    selfUserIdValidator('Vous ne pouvez pas modifier les champs d\'intervention d\'un autre intervenant'),
    themesValidator,
];
