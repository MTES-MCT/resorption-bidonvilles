/* eslint-disable newline-per-chained-call */
const { body } = require('express-validator');

module.exports = [
    /** *********************************************************************************************
     * L'organization fait-elle l'objet d'un financement de la DIHAL ? (BOOLEAN obligatoire)
     ********************************************************************************************* */
    body('data.being_funded')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Financement" est obligatoire')
        .isBoolean().bail().withMessage('Le champ "Financement" est invalide'),

    /* **********************************************************************************************
     * Date de mise à jour du champ "FINANCEMENT ?"
     ********************************************************************************************* */
    body('data.being_funded_at')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de mise à jour" est obligatoire')
        .isISO8601({ strict: true, strictSeparator: true }).bail().withMessage('Le champ "Date de mise à jour" est invalide')
        .custom((value) => {
            const today = new Date();
            if (value > today) {
                throw new Error('La date de mise à jour ne peut pas être future');
            }

            return true;
        }),
];
