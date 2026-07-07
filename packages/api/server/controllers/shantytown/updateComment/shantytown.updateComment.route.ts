import express from 'express';
import controller from './shantytown.updateComment';
import validator from './shantytown.updateComment.validator';

const router = express.Router();

router.patch(
    '/:id/comments/:commentId',
    validator,
    controller,
);

export default router;
