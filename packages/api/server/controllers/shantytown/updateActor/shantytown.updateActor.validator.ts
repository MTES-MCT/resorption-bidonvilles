import shantytownIdValidator from '#server/controllers/shantytown/_common/shantytown.id.validator';
import themesValidator from '#server/controllers/shantytown/_common/shantytown.actorThemes.validator';
import selfUserIdValidator from '#server/controllers/user/_common/user.id.validator';

export default [
    shantytownIdValidator,
    selfUserIdValidator('Vous ne pouvez pas modifier les champs d\'intervention d\'un autre intervenant'),
    themesValidator,
];
