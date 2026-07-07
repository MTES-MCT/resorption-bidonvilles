import express from 'express';
import controller from './action.updateComment';
import validator from './action.updateComment.validator';

const router = express.Router();

router.patch(
    '/:id/comments/:commentId',
    validator,
    controller,
);

export default router;
