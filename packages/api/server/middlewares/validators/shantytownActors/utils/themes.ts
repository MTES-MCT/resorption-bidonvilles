const { body } = require('express-validator');
const { trim } = require('validator');
const ACTOR_THEMES = require('#server/config/shantytown_actor_themes');

const ACTOR_THEME_IDS = Object.keys(ACTOR_THEMES);

module.exports = body('themes')
    .customSanitizer((value) => {
        if (value === undefined || value === null) {
            return [];
        }

        return value;
    })
    .isArray().bail()
    .withMessage('Les champs d\'intervention sont invalides')
    // trim the string values
    .customSanitizer(value => value.map((o) => {
        if (!o || typeof o.value !== 'string') {
            return o;
        }

        return { ...o, value: trim(o.value) };
    }))
    .custom((value) => {
    // check the structure of each item
        const duplicates = [];
        for (let i = 0; i < value.length; i += 1) {
            const item = value[i];
            if (!item || !Object.prototype.hasOwnProperty.call(item, 'id')) {
                throw new Error(`Le champ d'intervention ${i + 1} doit être un objet`);
            }

            if (!ACTOR_THEME_IDS.includes(item.id)) {
                throw new Error(`Le champ d'intervention ${i + 1} est inconnu`);
            }

            if (item.id === 'autre') {
                if (typeof item.value !== 'string') {
                    throw new Error(`Le champ d'intervention "${ACTOR_THEMES[item.id]}" doit avoir une valeur textuelle`);
                }
                if (item.value === '') {
                    throw new Error(`Le champ d'intervention "${ACTOR_THEMES[item.id]}" doit avoir une valeur`);
                }
            }

            if (duplicates.includes(item.id)) {
                throw new Error(`Le champ d'intervention ${ACTOR_THEMES[item.id]} est mentionné plusieurs fois`);
            }
            duplicates.push(item.id);
        }

        return true;
    });
