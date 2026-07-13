import shantytownCommentService from '#server/services/shantytownComment';
import makeDeleteCommentController from '#server/controllers/_common/makeDeleteCommentController';

export default makeDeleteCommentController(shantytownCommentService.deleteComment);
