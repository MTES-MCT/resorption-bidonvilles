import { body, param } from 'express-validator';

export default [
    param('id').isInt().withMessage('L\'identifiant du site est invalide').toInt(),
    param('commentId').isInt().withMessage('L\'identifiant du commentaire est invalide').toInt(),
    body('description').trim().notEmpty().withMessage('La description du commentaire ne peut pas être vide'),
];
