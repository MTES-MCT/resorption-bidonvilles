const { param } = require('express-validator');
const selfUserIdValidator = require('./utils/selfUserId');
const ACTOR_THEMES = require('#server/config/shantytown_actor_themes');

const ACTOR_THEME_IDS = Object.keys(ACTOR_THEMES);

module.exports = [
    selfUserIdValidator('Vous ne pouvez pas modifier les champs d\'intervention d\'un autre intervenant'),

    param('theme_id')
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
