import shantytownIdValidator from '#server/controllers/shantytown/_common/shantytown.id.validator';
import selfUserIdValidator from '#server/controllers/user/_common/user.id.validator';

export default [
    shantytownIdValidator,
    selfUserIdValidator('Vous ne pouvez pas retirer un autre intervenant'),
];
