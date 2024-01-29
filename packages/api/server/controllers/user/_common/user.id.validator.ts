import { param } from 'express-validator';

export default error => param('userId')
    .toInt()
    .isInt().bail()
    .withMessage('L\'identifiant de l\'intervenant est invalide')
    .custom(async (value, { req }) => {
        if (req.user.id !== value) {
            throw new Error(error);
        }

        const actor = req.shantytown.actors.find(({ id }) => id === value);
        if (actor === undefined) {
            throw new Error('Vous ne faites pas partie des intervenants');
        }

        req.body.user = req.user;
        req.body.actor = actor;
        return true;
    });
