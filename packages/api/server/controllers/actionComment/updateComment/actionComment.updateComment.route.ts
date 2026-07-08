import express from 'express';
import controller from './actionComment.updateComment';
import validator from './actionComment.updateComment.validator';

const router = express.Router();

router.patch(
    '/:id/comments/:commentId',
    validator,
    controller,
);

export default router;
