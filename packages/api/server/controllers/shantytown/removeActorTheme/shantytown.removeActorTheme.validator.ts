import { param } from 'express-validator';
import ACTOR_THEMES from '#server/config/shantytown_actor_themes';
import shantytownIdValidator from '#server/controllers/shantytown/_common/shantytown.id.validator';
import selfUserIdValidator from '#server/controllers/user/_common/user.id.validator';

const ACTOR_THEME_IDS = Object.keys(ACTOR_THEMES);

export default [
    shantytownIdValidator,

    selfUserIdValidator('Vous ne pouvez pas modifier les champs d\'intervention d\'un autre intervenant'),

    param('themeId')
        .custom((value, { req }) => {
            if (!ACTOR_THEME_IDS.includes(value)) {
                throw new Error('Le champ d\'intervention à supprimer n\'est pas reconnu');
            }

            if (!req.body.actor) {
                throw new Error('Vous ne faites pas partie des intervenants');
            }

            if (!req.body.actor.themes.some(({ id }) => id === value)) {
                throw new Error('Vous ne disposez pas de ce champ d\'intervention');
            }

            return true;
        }),

];
