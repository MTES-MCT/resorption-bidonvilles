import { body, param } from 'express-validator';

export default [
    param('id').toInt().isInt().withMessage('L\'identifiant de l\'action est invalide'),
    param('commentId').toInt().isInt().withMessage('L\'identifiant du commentaire est invalide'),
    body('description').trim().notEmpty().withMessage('La description du commentaire ne peut pas être vide'),
];
