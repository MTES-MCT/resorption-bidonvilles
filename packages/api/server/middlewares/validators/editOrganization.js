/* eslint-disable newline-per-chained-call */
const { body } = require('express-validator');

function fromIntToBoolSanitizer(value) {
    if (value === -1) {
        return null;
    }

    return value === 1;
}

module.exports = [
    /** *********************************************************************************************
     * L'organization fait-elle l'objet d'un financement de la DIHAL ? (BOOLEAN obligatoire)
     ********************************************************************************************* */
    body('being_funded')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Financement" est obligatoire')
        .toInt()
        .isInt({ min: -1, max: 1 }).withMessage('Le champ "Financement" est invalide')
        .customSanitizer(fromIntToBoolSanitizer),

    /* **********************************************************************************************
     * Date de mise à jour du champ "FINANCEMENT ?"
     ********************************************************************************************* */
    body('being_funded_at')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Date de mise à jour" est obligatoire')
        .isDate().bail().withMessage('Le champ "Date de mise à jour" est invalide')
        .toDate()
        .custom((value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de mise à jour ne peut pas être future');
            }

            return true;
        }),
];
